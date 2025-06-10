const express = require('express');
const router = express.Router();
const { registerUser, createContribution, getUserById} = require('../controllers/userController');
const multer = require("multer");
const upload = multer();

router.post("/contribute", upload.array("pdfFiles"), createContribution);
router.post('/register', registerUser);
router.get('/:id', getUserById);


module.exports = router;

