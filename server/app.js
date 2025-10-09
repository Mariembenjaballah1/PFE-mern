// app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const assetRoutes = require('./routes/assetRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const activitiesRoutes = require('./routes/activitiesRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} - Route matched`);
  next();
});

app.use('/api/assets', assetRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

module.exports = app;
