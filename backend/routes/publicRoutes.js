const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/branches", adminController.getAllBranches);
router.get(
  "/subjects/:branchName/:semesterNumber",
  adminController.getSubjectsBySemester
);
router.get(
  "/subjects/:branchName/:semesterNumber/:subjectName",
  adminController.getSubjectDetails
);

module.exports = router;
