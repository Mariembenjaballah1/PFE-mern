const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const assetRoutes = require('./routes/assetRoutes');
const userRoutes = require('./routes/userRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const activitiesRoutes = require('./routes/activitiesRoutes');
const authRoutes = require('./routes/authRoutes');
const statsRoutes = require('./routes/statsRoutes');

console.log('Registering asset routes...');

app.use('/api/assets', assetRoutes);
app.use('/api/users', userRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);

// IMPORTANT: Ne connecter à MongoDB que si ce n'est PAS un environnement de test
// Les tests géreront leur propre connexion avec MongoMemoryServer
if (process.env.NODE_ENV !== 'test') {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017/inventrackdb';
  
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'API InvenTrack is running' });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Démarrer le serveur uniquement si ce n'est pas un environnement de test
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Exporter l'app pour les tests
module.exports = app;