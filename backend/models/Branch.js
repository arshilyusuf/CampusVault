const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true,
    unique: true
  },
  semesters: [{
    semesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Semester'
    },
    semesterNumber: {
      type: Number,
      required: true
    }
  }]
});

module.exports = mongoose.model('Branch', branchSchema);
