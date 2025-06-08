const express = require('express');
const router = express.Router();
const { login, register, isAuthenticated } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/isAuthenticated', isAuthenticated);

module.exports = router;
