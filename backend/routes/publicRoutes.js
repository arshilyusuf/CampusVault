const express = require("express");
const router = express.Router();
const publicController = require("../controllers/publicController");

router.get(
  "/subjects/:branchName/:semesterNumber",
  publicController.getSubjectsBySemester
);
router.get(
  "/subjects/:branchName/:semesterNumber/:subjectName",
  publicController.getSubjectDetails
);

module.exports = router;
