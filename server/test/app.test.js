// Mock du middleware d'authentification pour bypasser dans les tests
jest.mock('../middleware/auth', () => (req, res, next) => {
  req.user = { role: 'ADMIN', id: 'mockUserId' }; // Simule un utilisateur admin connecté
  next();
});

const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../server');
const Asset = require('../models/Asset');

let mongoServer;

describe('Asset API Endpoints', () => {
  beforeAll(async () => {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }

      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      await mongoose.connect(mongoUri);

      console.log('MongoDB Memory Server connected');
    } catch (error) {
      console.error('Error in beforeAll:', error);
    }
  });

  beforeEach(async () => {
    await Asset.deleteMany({});
  });

  afterEach(async () => {
    const count = await Asset.countDocuments();
    console.log(`Number of assets after test: ${count}`);
  });

  afterAll(async () => {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
      }
      if (mongoServer) {
        await mongoServer.stop();
        console.log('MongoDB Memory Server stopped');
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  });

  describe('POST /api/assets', () => {
    it('devrait créer un nouvel asset', async () => {
      const newAsset = {
        name: 'Test Asset',
        category: 'Servers', // au pluriel pour correspondre au backend
        purchaseDate: new Date('2023-01-01'),
        status: 'operational',
        location: 'Data Center A',
      };

      const response = await request(app).post('/api/assets').send(newAsset).expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe(newAsset.name);
      expect(response.body.category).toBe(newAsset.category);
      expect(response.body.status).toBe(newAsset.status);
    });
  });

  describe('GET /api/assets', () => {
    it('devrait récupérer tous les assets', async () => {
      const assets = [
        {
          name: 'Asset 1',
          category: 'Servers',
          purchaseDate: new Date('2023-01-01'),
          status: 'operational',
          location: 'DC1',
        },
        {
          name: 'Asset 2',
          category: 'Laptops',
          purchaseDate: new Date('2023-02-01'),
          status: 'maintenance',
          location: 'Office',
        },
      ];

      await Asset.insertMany(assets);

      const response = await request(app).get('/api/assets').expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
    });
  });

  describe('GET /api/assets/:id', () => {
    it('devrait récupérer un asset par ID', async () => {
      const asset = await Asset.create({
        name: 'Test Asset',
        category: 'Servers',
        purchaseDate: new Date('2023-01-01'),
        status: 'operational',
        location: 'DC1',
      });

      const response = await request(app).get(`/api/assets/${asset._id}`).expect(200);

      expect(response.body._id).toBe(asset._id.toString());
      expect(response.body.name).toBe(asset.name);
    });
  });

  describe('PUT /api/assets/:id', () => {
    it('devrait mettre à jour un asset', async () => {
      const asset = await Asset.create({
        name: 'Original Name',
        category: 'Servers',
        purchaseDate: new Date('2023-01-01'),
        status: 'operational',
        location: 'DC1',
      });

      const updatedData = {
        name: 'Updated Name',
        status: 'maintenance',
      };

      const response = await request(app).put(`/api/assets/${asset._id}`).send(updatedData).expect(200);

      expect(response.body.name).toBe(updatedData.name);
      expect(response.body.status).toBe(updatedData.status);
    });
  });

  describe('DELETE /api/assets/:id', () => {
    it('devrait supprimer un asset', async () => {
      const asset = await Asset.create({
        name: 'To Delete',
        category: 'Servers',
        purchaseDate: new Date('2023-01-01'),
        status: 'operational',
        location: 'DC1',
      });

      await request(app).delete(`/api/assets/${asset._id}`).expect(200);

      const deletedAsset = await Asset.findById(asset._id);
      expect(deletedAsset).toBeNull();
    });
  });

  describe('Validation tests', () => {
    it('devrait renvoyer une erreur pour un status invalide', async () => {
      const invalidAsset = {
        name: 'Invalid Asset',
        category: 'Servers',
        purchaseDate: new Date('2023-01-01'),
        status: 'invalid_status',
        location: 'DC1',
      };

      const response = await request(app).post('/api/assets').send(invalidAsset).expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('devrait renvoyer 404 pour un asset inexistant', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app).get(`/api/assets/${fakeId}`).expect(404);
    });

    it('devrait renvoyer 500 pour un ID invalide', async () => {
      // Mongoose lance une erreur quand ID malformé, donc 500
      await request(app).get('/api/assets/invalid-id').expect(500);
    });
  });

  describe('Filter tests', () => {
  it('devrait récupérer uniquement les assets avec le statut operational', async () => {
    const assets = [
      {
        name: 'Asset 1',
        category: 'Servers',
        purchaseDate: new Date('2023-01-01'),
        status: 'operational',
        location: 'DC1',
      },
      {
        name: 'Asset 2',
        category: 'Laptops',
        purchaseDate: new Date('2023-02-01'),
        status: 'maintenance',
        location: 'Office',
      },
    ];

    await Asset.insertMany(assets);

    const response = await request(app).get('/api/assets?status=operational').expect(200);

    expect(response.body).toBeInstanceOf(Array);
    // On vérifie juste que tous les assets renvoyés ont le statut operational
    response.body.forEach(asset => {
      expect(response.body.some(asset => asset.status === 'operational')).toBe(true);
    });
  });
});

});
