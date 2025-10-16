const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} - Route matched`);
  next();
});

console.log('Registering asset routes...');
app.use('/api/assets', assetRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/stats', statsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /api/health',
      'GET /api/projects',
      'GET /api/projects/resources/usage',
      'GET /api/projects/:id',
      'GET /api/projects/:id/assets',
      'POST /api/projects',
      'PATCH /api/projects/:id',
      'DELETE /api/projects/:id',
      'GET /api/assets',
      'GET /api/assets/test/ping',
      'DELETE /api/assets/servers/all',
      'POST /api/assets',
      'GET /api/maintenance',
      'GET /api/users',
      'POST /api/auth/login',
      'GET /api/activities',
      'POST /api/activities',
      'GET /api/stats/dashboard',
      'GET /api/stats/trends',
    ],
  });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Connect to MongoDB only if NOT in test environment
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/inventrackdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });

  // Start server only if NOT in test environment
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the app for tests (so tests can manage connection to MongoMemoryServer)
module.exports = app;
