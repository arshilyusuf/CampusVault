const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: 'user' },
        branchName: { type: String },
        semesterNumber: { type: Number },
        rollNumber: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
