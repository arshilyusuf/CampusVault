const express = require('express');
const router = express.Router();
const { login, isAuthenticated } = require('../controllers/authController');

router.post('/login', login);
router.get('/isAuthenticated', isAuthenticated);

module.exports = router;
