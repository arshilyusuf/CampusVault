const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  branchName: {
    type: String,
    required: true,
  },
  semesterNumber: {
    type: Number,
    required: true,
  },
  other: [
    {
      type: String,
    },
  ],
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
