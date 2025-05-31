const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/branches", adminController.addBranch);
router.get("/branches", adminController.getAllBranches);

router.get(
  "/subjects/:branchName/:semesterNumber",
  adminController.getSubjectsBySemester
);
router.post("/subjects", adminController.addSubjectToSemester);

router.post(
  "/subjects/uploadPdf",
  upload.single("pdf"),
  adminController.uploadPdfToSubject
);
module.exports = router;
