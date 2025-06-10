const Request = require('../models/Request');

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
