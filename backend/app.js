const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
// const dataRoutes = require('./routes/dataRoutes');
// const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);
// app.use('/api', dataRoutes);
// app.use('/api/feedback', feedbackRoutes);

module.exports = app;
