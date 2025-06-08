const Request = require('../models/Request');

// Create a new material request
exports.createRequest = async (req, res) => {
    try {
        const { branchName, semesterNumber, subjectName, uploadType } = req.params;
        const requestingUser = req.user._id;

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
        res.status(500).json({ message: error.message });
    }
};
