const Request = require('../models/Request');
const sendEmail = require('../utils/sendEmail'); // Adjust path as needed
const User = require("../models/User");
// Create a new material request
exports.createRequest = async (req, res) => {
    try {
        const { branchName, semesterNumber, subjectName, uploadType } = req.params;
        const { requestingUser } = req.body;

        // Check if a similar request already exists and is not yet uploaded
        const existingRequest = await Request.findOne({
            branchName,
            semesterNumber,
            subjectName,
            uploadType,
            requestingUser,
            status: { $ne: 'uploaded' }
        });

        if (existingRequest) {
            return res.status(400).json({ message: "You have already requested this material." });
        }

        const newRequest = new Request({
            branchName,
            semesterNumber,
            subjectName,
            uploadType,
            requestingUser,
        });

        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (error) {
        console.error("Error in createRequest:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// Get all requests by branch and yearNumber (maps to semesters)
exports.getRequestsByBranchAndYear = async (req, res) => {
    try {
        const { branchName, yearNumber } = req.params;
        if (!branchName || !yearNumber) {
            return res.status(400).json({ message: "branchName and yearNumber are required" });
        }

        // Map yearNumber to semesters
        const year = parseInt(yearNumber, 10);
        let semesters = [];
        if (!isNaN(year) && year > 0) {
            semesters = [year * 2 - 1, year * 2];
        } else {
            return res.status(400).json({ message: "Invalid yearNumber" });
        }

        const requests = await Request.find({
            branchName,
            semesterNumber: { $in: semesters }
        });
        res.json(requests);
    } catch (error) {
        console.error("Error in getRequestsByBranchAndYear:", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteRequestAndNotify = async (req, res) => {
  try {
    const { requestId } = req.params;
    if (!requestId) {
      return res.status(400).json({ message: "requestId is required" });
    }

    // Find the request
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Find the user who made the request
    const user = await User.findById(request.requestingUser);
    if (!user) {
      return res.status(404).json({ message: "Requesting user not found" });
    }

    // Delete the request
    const deletedRequest = await Request.findByIdAndDelete(requestId);

    await sendEmail({
      to: user.email,
      subject: "Your material request has been reviewed and resolved.",
      text: `Hello ${user.name || ""},\n\nYour request for "${
        request.subjectName
      }" (Semester ${request.semesterNumber}, Type: ${
        request.uploadType
      }) has been reviewed and resolved by the admin.\n\nThank you for using CampusVault!`,
    });

    // Send back some deleted request info
    res.status(200).json({
      message: "Request deleted and user notified.",
      deletedRequest: {
        _id: deletedRequest._id,
        subjectName: deletedRequest.subjectName,
        uploadType: deletedRequest.uploadType,
        semesterNumber: deletedRequest.semesterNumber,
        userEmail: user.email,
        userName: user.name,
      },
    });
  } catch (error) {
    console.error("Error in deleteRequestAndNotify:", error.message);
    res.status(500).json({ message: error.message });
  }
};
  