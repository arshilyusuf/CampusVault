const express = require('express');
const router = express.Router();
const { createRequest, getRequestsByBranchAndYear } = require('../controllers/requestController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/:branchName/:semesterNumber/:subjectName/:uploadType', createRequest);
router.get('/:branchName/:yearNumber', protectAdmin, getRequestsByBranchAndYear);


module.exports = router;
