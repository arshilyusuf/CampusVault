const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema(
    {
        branchName: { type: String, required: true },
        semesterNumber: { type: Number, required: true },
        subjectName: { type: String, required: true },
        uploadType: { type: String, required: true },
        requestingUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: ['pending', 'rejected', 'uploaded'], default: 'pending' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Request', RequestSchema);
