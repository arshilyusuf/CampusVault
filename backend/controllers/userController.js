const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Contribution = require("../models/Contribution"); // Assuming you'll create a Contribution model
const cloudinary = require("../utils/cloudinary"); // Assuming you have a cloudinary config

const registerUser = async (req, res) => {
  try {
    const {
      email,
      password,
      branchName,
      semesterNumber,
      rollNumber,
      name,
      yearNumber,
    } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const role = "user"; 

    user = new User({
      email,
      password,
      branchName,
      role,
      semesterNumber,
      rollNumber,
      name,
      yearNumber,
    });

    await user.save();

    // Return JWT
    const payload = {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        branchName: user.branchName,
        semesterNumber: user.semesterNumber,
        rollNumber: user.rollNumber,
        name: user.name,
        yearNumber: user.yearNumber,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: payload.user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const uploadPdfToCloudinary = async (file, folderPath) => {
  try {
    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: "raw",
      folder: folderPath,
    });

    const pdfUrl = result.secure_url + "?inline=true";
    return pdfUrl;
  } catch (error) {
    console.error("Error uploading PDF to Cloudinary:", error);
    throw error;
  }
};

const createContribution = async (req, res) => {
  try {
    console.log("req.body:", req.body);

    const { branchName, semesterNumber, subjectName, uploadType, user, pdfFiles } = req.body;
    const userId = user.id; 

    if (!branchName || !semesterNumber || !subjectName || !uploadType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!pdfFiles || Object.keys(pdfFiles).length === 0) {
      return res.status(400).json({ message: "No PDF files provided" });
    }

    const pdfUrls = [];
    for (const file of pdfFiles) {
      try {
        const folderPath = `${user.rollNumber}`;
        const pdfUrl = await uploadPdfToCloudinary(file, folderPath);
        pdfUrls.push(pdfUrl);
      } catch (uploadError) {
        console.error("Error uploading file:", uploadError);
        return res.status(500).json({ message: "Failed to upload one or more files" });
      }
    }

    const newContribution = new Contribution({
      branchName,
      semesterNumber,
      subjectName,
      uploadType,
      userId,
      pdfUrls: pdfUrls, // Store the array of PDF URLs
    });

    await newContribution.save();

    res.status(201).json({ message: "Contribution request submitted successfully" });
  } catch (error) {
    console.error("Error in createContribution:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  createContribution,
};
