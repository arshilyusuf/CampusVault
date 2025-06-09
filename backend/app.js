const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const requestRoutes = require('./routes/requestRoutes');
const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
