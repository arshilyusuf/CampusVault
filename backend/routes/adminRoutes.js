const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const multer = require("multer");
const { protect } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.use(protect);

router.post("/branches", adminController.addBranch);
router.post(
  "/uploadPdf",
  upload.array("pdfFiles"),
  adminController.uploadPdfToSubject
);
router.post("/addSubject", adminController.addSubject);
router.get("/contributions/:branchName/:yearNumber", adminController.getContributionsByBranchAndYear);
router.get("/approveContribution/:id", adminController.approveContribution);
router.get("/rejectContribution/:id", adminController.rejectContribution);
module.exports = router;