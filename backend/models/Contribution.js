const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema({
  branchName: { type: String, required: true },
  semesterNumber: { type: Number, required: true },
  subjectName: { type: String, required: true },
  uploadType: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pdfUrls: [
    { type: String, required: true }, // Array of PDF URLs
  ],
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Contribution", contributionSchema);
