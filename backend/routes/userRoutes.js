const express = require('express');
const router = express.Router();
const { registerUser, createContribution } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/contribute', createContribution);

module.exports = router;

