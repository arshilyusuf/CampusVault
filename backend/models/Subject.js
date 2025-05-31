const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  semesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
    required: true
  },
  semesterNumber: { 
    type: Number,
    required: true
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  branchName: { 
    type: String,
    required: true
  },
  midsem: [{
    type: String 
  }],
  endsem: [{
    type: String 
  }],
  other: [{
    type: String  
  }]
});

module.exports = mongoose.model('Subject', subjectSchema);
