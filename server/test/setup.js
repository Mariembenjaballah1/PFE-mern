const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  // IMPORTANT: Fermer toute connexion existante avant d'en créer une nouvelle
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Supprimer les options dépréciées qui causent des warnings
  await mongoose.connect(uri);
}, 60000); // Timeout de 60 secondes pour beforeAll

afterEach(async () => {
  // Vérifier que la connexion existe avant d'essayer de nettoyer
  if (mongoose.connection.readyState === 1) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
}, 10000);

afterAll(async () => {
  try {
    // Nettoyer dans le bon ordre
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
    
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}, 60000); // Timeout de 60 secondes pour afterAll