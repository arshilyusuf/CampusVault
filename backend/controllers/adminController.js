const Branch = require('../models/Branch');
const Semester = require('../models/Semester');
const Subject = require('../models/Subject');
const Contribution = require('../models/Contribution');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const addBranch = async (req, res) => {
  try {
    const { branchName } = req.body;
    let branch = await Branch.findOne({ branchName });
    if (branch) {
      return res.status(400).json({ message: 'Branch already exists' });
    }
    branch = new Branch({ branchName: branchName });
    const savedBranch = await branch.save();
    for (let i = 1; i <= 8; i++) {
      const semester = new Semester({
        branchId: savedBranch._id,
        branchName: savedBranch.branchName,
        semesterNumber: i,
      });
      await semester.save();
    }
    res.status(201).json(savedBranch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const getSubjectsBySemester = async (req, res) => {
  try {
    const { branchName, semesterNumber } = req.params;
    if (!branchName || !semesterNumber) {
      return res.status(400).json({
        message: "Branch name and semester number are required",
      });
    }

    const branch = await Branch.findOne({ branchName });
    if (!branch) {
      return res
        .status(404)
        .json({ message: `Branch '${branchName}' not found` });
    }

    const semester = await Semester.findOne({
      branchId: branch._id,
      semesterNumber: Number(semesterNumber),
    }).populate("subjects.subjectId");

    if (!semester) {
      return res.status(404).json({
        message: `Semester ${semesterNumber} not found for branch '${branchName}'`,
      });
    }

    const subjects = await Promise.all(semester.subjects.map(async (s) => {
      const subj = await Subject.findById(s.subjectId);
      return {
        _id: subj._id,
        name: subj.name,
        subjectName: subj.name,
        semesterId: semester._id,
        semesterNumber: semester.semesterNumber,
        branchId: branch._id,
        branchName: branch.branchName,
        __v: subj.__v,
        midsem: subj.midsem || [],
        endsem: subj.endsem || [],
        notes: subj.notes || [],
        lectures: subj.lectures || [],
        other: subj.other || [],
      };
    }));

    res.status(200).json({ subjects });
  } catch (err) {
    console.error("Error fetching subjects by semester:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    res.status(200).json(branches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uploadPdfs = upload.array('pdfFiles');

const uploadPdfToCloudinary = async (file, folderPath) => {
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    resource_type: "raw",
    folder: folderPath,
  });
  return result.secure_url;
};

const uploadPdfToSubject = async (req, res) => {
  

    try {
      if (!req.body) {
        return res.status(400).json({ message: "Request body is required" });
      }
      
      const { branchName, semesterNumber, subjectName, uploadType, user } = req.body;      
      let userObj = user;
      if (typeof user === "string") {
        try {
          userObj = JSON.parse(user);
        } catch (e) {
          return res.status(400).json({ message: "Invalid user data" });
        }
      }

      const userId = userObj.id;
      if (!userId) {
        return res.status(400).json({ message: "Authentication Failed" });
      }

      if (!branchName || !semesterNumber || !subjectName || !uploadType) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No PDF files provided" });
      }

      // Step 1: Upload PDFs to contributions/{rollNumber}
      const pdfUrls = [];
      for (const file of req.files) {
        try {
          const folderPath = `contributions/${userObj.rollNumber}`;
          const pdfUrl = await uploadPdfToCloudinary(file, folderPath);
          // Remove '?inline=true' if present
          pdfUrls.push(pdfUrl.replace(/\?inline=true$/, ""));
        } catch (uploadError) {
          console.error("Error uploading file:", uploadError);
          return res.status(500).json({ message: "Failed to upload one or more files" });
        }
      }

      // Step 2: Find branch, semester, subject
      const branch = await Branch.findOne({ branchName });
      if (!branch) {
        return res.status(404).json({ message: `Branch '${branchName}' not found` });
      }
      const semester = await Semester.findOne({
        branchId: branch._id,
        semesterNumber: Number(semesterNumber),
      });
      if (!semester) {
        return res.status(404).json({
          message: `Semester ${semesterNumber} not found for branch '${branchName}'`,
        });
      }
      let subject = await Subject.findOne({ name: subjectName });
      if (!subject) {
        return res.status(404).json({ message: `Subject '${subjectName}' not found` });
      }

      // Step 3: Move PDFs to subject folder and update subject
      const targetFolder = `${branchName}/${semesterNumber}/${subjectName}/${uploadType}`;
      for (const url of pdfUrls) {
        const matches = url.match(/\/upload\/v\d+\/([^\s]+)/);
        if (!matches || !matches[1]) {
          console.warn(`Could not extract public_id from URL: ${url}`);
          continue;
        }
        let originalPublicId = matches[1].replace(/\.[^/.]+$/, "");
        const fileBuffer = await fetch(url).then((res) => res.arrayBuffer());
        const fileName = originalPublicId.split("/").pop();
        const dataUri = `data:application/pdf;base64,${Buffer.from(fileBuffer).toString("base64")}`;
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          resource_type: "raw",
          folder: targetFolder,
          public_id: fileName,
        });
        const newPdfUrl = uploadResult.secure_url;

        if (Array.isArray(subject[uploadType])) {
          subject[uploadType].push(newPdfUrl);
        } else {
          subject[uploadType] = [newPdfUrl];
        }
      }

      await subject.save();
      res.status(200).json({
        message: "Contribution approved and material uploaded",
        subject,
      });
    } catch (err) {
      console.error("Error uploading PDF to subject:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  
};

const getSubjectDetails = async (req, res) => {
  try {
    const { branchName, semesterNumber, subjectName } = req.params;

    if (!branchName || !semesterNumber || !subjectName) {
      return res.status(400).json({
        message: "Branch name, semester number, and subject name are required",
      });
    }

    const branch = await Branch.findOne({ branchName });
    if (!branch) {
      return res
        .status(404)
        .json({ message: `Branch '${branchName}' not found` });
    }

    const semester = await Semester.findOne({
      branchId: branch._id,
      semesterNumber: Number(semesterNumber),
    });

    if (!semester) {
      return res.status(404).json({
        message: `Semester ${semesterNumber} not found for branch '${branchName}'`,
      });
    }

    const subject = await Subject.findOne({ name: subjectName });

    if (!subject) {
      return res
        .status(404)
        .json({ message: `Subject '${subjectName}' not found` });
    }

    res.status(200).json({ subject });
  } catch (err) {
    console.error("Error fetching subject details:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getContributionsByBranchAndYear = async (req, res) => {
  try {
    const { branchName, yearNumber } = req.params;
    if (!branchName || !yearNumber) {
      return res.status(400).json({ message: "branchName and yearNumber are required" });
    }
    const year = parseInt(yearNumber, 10);
    if (isNaN(year) || year < 1) {
      return res.status(400).json({ message: "Invalid yearNumber" });
    }
    // Map yearNumber to semesters: 1=>[1,2], 2=>[3,4], 3=>[5,6], 4=>[7,8]
    const semesters = [year * 2 - 1, year * 2];
    const contributions = await Contribution.find({
      branchName,
      semesterNumber: { $in: semesters }
    });
    res.status(200).json(contributions);
  } catch (err) {
    console.error("Error fetching contributions by branch and year:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const approveContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const contribution = await Contribution.findById(id);
    if (!contribution) {
      return res.status(404).json({ message: "Contribution not found" });
    }

    const { branchName, semesterNumber, subjectName, uploadType, pdfUrls } =
      contribution;

    const branch = await Branch.findOne({ branchName });
    if (!branch) {
      return res
        .status(404)
        .json({ message: `Branch '${branchName}' not found` });
    }
    const semester = await Semester.findOne({
      branchId: branch._id,
      semesterNumber: Number(semesterNumber),
    });
    if (!semester) {
      return res
        .status(404)
        .json({
          message: `Semester ${semesterNumber} not found for branch '${branchName}'`,
        });
    }
    let subject = await Subject.findOne({ name: subjectName });
    if (!subject) {
      return res
        .status(404)
        .json({ message: `Subject '${subjectName}' not found` });
    }

    const targetFolder = `${branchName}/${semesterNumber}/${subjectName}/${uploadType}`;

    for (const url of pdfUrls) {
      const matches = url.match(/\/upload\/v\d+\/([^\s]+)/);
      if (!matches || !matches[1]) {
        console.warn(`Could not extract public_id from URL: ${url}`);
        continue;
      }
      let originalPublicId = matches[1].replace(/\.[^/.]+$/, "");
      console.log("Extracted public ID:", originalPublicId);

      const fileBuffer = await fetch(url).then((res) => res.arrayBuffer());

      const fileName = originalPublicId.split("/").pop();
      const dataUri = `data:application/pdf;base64,${Buffer.from(
        fileBuffer
      ).toString("base64")}`;
      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        resource_type: "raw", 
        folder: targetFolder,
        public_id: fileName,
      });
      console.log(`Uploaded PDF to Cloudinary: ${uploadResult.secure_url}`);
      const newPdfUrl = uploadResult.secure_url;

      if (Array.isArray(subject[uploadType])) {
        subject[uploadType].push(newPdfUrl);
      } else {
        subject[uploadType] = [newPdfUrl];
      }
      console.log(`Added ${uploadType} PDF to subject:`, newPdfUrl);

      try {
        console.log(`Deleting original PDF from Cloudinary: ${url}`);
        const result = await cloudinary.uploader.destroy(originalPublicId, {
          resource_type: "raw",
        });
        console.log(`Deleted original PDF from Cloudinary: ${url}`, result);
        if (result.result !== "ok" && result.result !== "not found") {
          console.error(`Failed to delete ${url}:`, result); 
        }
      } catch (err) {
        if (err.http_code === 404) {
          console.log(`Resource not found, skipping deletion: ${url}`);
        } else {
          console.error(`Failed to delete from Cloudinary: ${url}`, err);
        }
      }
    }

    await subject.save();
    console.log(`Subject updated with new ${uploadType} PDFs:`, subject);
    await Contribution.findByIdAndDelete(id);
    console.log(`Contribution approved and deleted: ${id}`);

    res
      .status(200)
      .json({
        message: "Contribution approved and material uploaded",
        subject,
      });
  } catch (err) {
    console.error("Error approving contribution:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rejectContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const contribution = await Contribution.findById(id);

    if (!contribution) {
      return res.status(404).json({ message: "Contribution not found" });
    }

    const { pdfUrls } = contribution;

    for (const url of pdfUrls) {
      const matches = url.match(/\/upload\/v\d+\/([^\s]+)/);
      if (!matches || !matches[1]) {
        console.warn(`Could not extract public_id from URL: ${url}`);
        continue;
      }
      let originalPublicId = matches[1].replace(/\.[^/.]+$/, "");
      console.log("Extracted public ID for deletion:", originalPublicId);

      try {
        console.log(`Deleting original PDF from Cloudinary: ${url}`);
        const result = await cloudinary.uploader.destroy(originalPublicId, {
          resource_type: "raw",
        });
        console.log(`Deleted original PDF from Cloudinary: ${url}`, result);
        if (result.result !== "ok" && result.result !== "not found") {
          console.error(`Failed to delete ${url}:`, result);
        }
      } catch (err) {
        if (err.http_code === 404) {
          console.log(`Resource not found, skipping deletion: ${url}`);
        } else {
          console.error(`Failed to delete from Cloudinary: ${url}`, err);
        }
      }
    }

    await Contribution.findByIdAndDelete(id);
    console.log(`Contribution rejected and deleted: ${id}`);

    res.status(200).json({ message: "Contribution rejected and deleted" });
  } catch (err) {
    console.error("Error rejecting contribution:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addSubject = async (req, res) => {
  try {
    const { branchName, semesterNumber, subjectName } = req.body;
    const user = req.user;

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }

    if (!branchName || !semesterNumber || !subjectName) {
      return res.status(400).json({ message: "Branch name, semester number, and subject name are required" });
    }

    if (user.branchName !== branchName) {
      return res.status(403).json({ message: "Unauthorized: Admin can only add subjects to their own branch" });
    }

    const yearNumber = user.yearNumber;
    const semester = Number(semesterNumber);

    if (isNaN(semester) || semester < 1 || semester > 8) {
      return res.status(400).json({ message: "Invalid semester number" });
    }

    const allowedSemesters = [];
    for (let i = 1; i <= yearNumber * 2; i++) {
      allowedSemesters.push(i);
    }

    if (!allowedSemesters.includes(semester)) {
      return res.status(403).json({ message: "Unauthorized: Admin cannot add subjects to this semester based on their year" });
    }

    const branch = await Branch.findOne({ branchName });
    if (!branch) {
      return res.status(404).json({ message: `Branch '${branchName}' not found` });
    }

    let semesterDoc = await Semester.findOne({
      branchId: branch._id,
      semesterNumber: semester,
    });

    if (!semesterDoc) {
      return res.status(404).json({
        message: `Semester ${semesterNumber} not found for branch '${branchName}'`,
      });
    }

    let subject = await Subject.findOne({ name: subjectName, branchName: branchName });
    if (subject) {
      return res.status(400).json({ message: 'Subject already exists in this branch' });
    }

    subject = new Subject({ name: subjectName, branchName: branchName, semesterNumber:user.semesterNumber });
    const savedSubject = await subject.save();

    semesterDoc.subjects.push({ subjectId: savedSubject._id, subjectName: savedSubject.name });
    await semesterDoc.save();

    res.status(201).json({ message: "Subject added successfully", subject: savedSubject });

  } catch (err) {
    console.error("Error adding subject:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  addBranch,
  getAllBranches,
  getSubjectsBySemester,
  uploadPdfToSubject,
  getSubjectDetails,
  getContributionsByBranchAndYear,
  approveContribution,
  rejectContribution,
  addSubject,
};