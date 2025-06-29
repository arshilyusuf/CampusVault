const Branch = require("../models/Branch");
const Semester = require("../models/Semester");
const Subject = require("../models/Subject");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");

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
      resource_type: "raw",
      folder: folderPath,
    });

    const pdfUrl = result.secure_url + "?inline=true";

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

module.exports = {
      getSubjectsBySemester,
      uploadPdfToSubject,
      getSubjectDetails,
      };