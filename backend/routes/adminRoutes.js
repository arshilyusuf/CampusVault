const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const multer = require("multer");
const { protect } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Protect all admin routes
router.use(protect);

router.post("/branches", adminController.addBranch);
router.post("/subjects", adminController.addSubjectToSemester);
router.post(
  "/subjects/uploadPdf",
  upload.single("pdf"),
  adminController.uploadPdfToSubject
);

module.exports = router;
