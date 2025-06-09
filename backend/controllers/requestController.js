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
