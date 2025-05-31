const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  branchName: {
    // Added branchName field
    type: String,
    required: true,
  },
  semesterNumber: {
    type: Number,
    required: true,
  },
  subjects: [
    {
      subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
      subjectName: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Semester", semesterSchema);
