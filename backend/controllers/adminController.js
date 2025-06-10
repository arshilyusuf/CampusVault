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

const addSubjectToSemester = async (req, res) => {
  try {
    const { branchName, semesterNumber, subjectName } = req.body;
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
      return res
        .status(404)
        .json({
          message: `Semester ${semesterNumber} not found for branch '${branchName}'`,
        });
    }
    let subject = await Subject.findOne({ name: subjectName });
    if (!subject) {
      subject = new Subject({ name: subjectName });
      await subject.save();
    }
    semester.subjects.push({
      subjectId: subject._id,
      subjectName: subject.name,
    });
    await semester.save();
    res.status(200).json({ message: 'Subject added to semester successfully', semester });
  } catch (err) {
    console.error("Error adding subject to semester:", err);
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

const uploadPdfToSubject = async (req, res) => {
  try {
    const { branchName, semesterNumber, subjectName, uploadType } = req.body;

    if (!branchName || !semesterNumber || !subjectName || !uploadType) {
      return res.status(400).json({
        message:
          "Branch name, semester number, subject name, and upload type are required",
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

    let subject = await Subject.findOne({ name: subjectName });
    if (!subject) {
      return res
        .status(404)
        .json({ message: `Subject '${subjectName}' not found` });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const folderPath = `${branchName}/${semesterNumber}/${subjectName}/${uploadType}`;

    const dataUri = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: "auto",
      folder: folderPath,
    });

    const pdfUrl = result.secure_url;

    if (Array.isArray(subject[uploadType])) {
      subject[uploadType].push(pdfUrl);
    } else {
      subject[uploadType] = [pdfUrl];
    }

    console.log(`Uploaded ${uploadType} PDF to Cloudinary:`, pdfUrl);
    await subject.save();

    res.status(200).json({ message: "PDF uploaded successfully", subject });
  } catch (err) {
    console.error("Error uploading PDF to Cloudinary:", err);
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

// Approve a contribution: move PDFs to subject, update DB, delete from contributions folder
const approveContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const contribution = await Contribution.findById(id);
    if (!contribution) {
      return res.status(404).json({ message: "Contribution not found" });
    }

    const { branchName, semesterNumber, subjectName, uploadType, pdfUrls } =
      contribution;

    // Find subject
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

    // Target folder for approved material
    const targetFolder = `${branchName}/${semesterNumber}/${subjectName}/${uploadType}`;

    // For each PDF: copy to new folder in Cloudinary, add to subject, delete from contributions folder
    for (const url of pdfUrls) {
      // Extract public_id from the original url
      const matches = url.match(/\/upload\/([^?]+)/);
      if (!matches || !matches[1]) {
        console.warn(`Could not extract public_id from URL: ${url}`);
        continue;
      }
      const originalPublicId = matches[1].replace(/\.[^/.]+$/, "");

      // Download the file from Cloudinary
      const fileBuffer = await fetch(url).then((res) => res.arrayBuffer());

      // Upload to the new folder in Cloudinary
      const fileName = originalPublicId.split("/").pop();
      const dataUri = `data:application/pdf;base64,${Buffer.from(
        fileBuffer
      ).toString("base64")}`;
      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        resource_type: "raw", // Use "raw" for PDFs
        folder: targetFolder,
        public_id: fileName,
      });
      const newPdfUrl = uploadResult.secure_url;

      // Add to subject's uploadType array
      if (Array.isArray(subject[uploadType])) {
        subject[uploadType].push(newPdfUrl);
      } else {
        subject[uploadType] = [newPdfUrl];
      }

      // Delete the original file from the contributions folder in Cloudinary
      try {
        // Use resource_type: "raw" for PDFs (not "auto")
        const result = await cloudinary.uploader.destroy(originalPublicId, {
          resource_type: "raw",
        });
        console.log(`Deleted original PDF from Cloudinary: ${url}`, result); // Log the result
        if (result.result !== "ok") {
          console.error(`Failed to delete ${url}:`, result); // Log if deletion failed
        }
      } catch (err) {
        console.error(`Failed to delete from Cloudinary: ${url}`, err);
      }
    }

    await subject.save();
    await Contribution.findByIdAndDelete(id);

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

module.exports = {
  addBranch,
  getAllBranches,
  getSubjectsBySemester,
  addSubjectToSemester,
  uploadPdfToSubject,
  getSubjectDetails,
  getContributionsByBranchAndYear,
  approveContribution,
};