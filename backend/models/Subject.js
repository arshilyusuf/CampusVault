const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  semesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
    
  },
  semesterNumber: {
    type: Number,
    required: true,
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
   
  },
  branchName: {
    type: String,
    required: true,
  },
  midsem: [
    {
      type: String,
    },
  ],
  endsem: [
    {
      type: String,
    },
  ],
  notes: [
    {
      type: String,
    },
  ],
  lectures: [
    {
      type: String,
    },
  ],
  other: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model('Subject', subjectSchema);
