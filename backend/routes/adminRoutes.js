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
router.get("/contributions/:branchName/:yearNumber", adminController.getContributionsByBranchAndYear);
router.get("/approveContribution/:id", adminController.approveContribution);
router.get("/rejectContribution/:id", adminController.rejectContribution);
module.exports = router;
