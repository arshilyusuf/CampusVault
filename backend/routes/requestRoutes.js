const express = require('express');
const router = express.Router();
const { createRequest } = require('../controllers/requestController');

router.post('/:branchName/:semesterNumber/:subjectName/:uploadType', createRequest);

module.exports = router;
