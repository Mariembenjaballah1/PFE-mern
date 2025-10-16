const {  connect, clearDatabase, closeDatabase } = require('./setup'); // tu dois avoir un fichier setup.js qui gère ça
jest.mock('../middleware/auth', () => (req, res, next) => {
  req.user = { role: 'ADMIN', id: 'mockUserId' };
  next();
});

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Asset = require('../models/Asset');

describe('Asset API Endpoints', () => {
  beforeAll(async () => {
    await connect();
  });

  beforeEach(async () => {
    await Asset.deleteMany({});
  });

  afterAll(async () => {
    await  closeDatabase();
  });

  // ✅ TEST: Création
  describe('POST /api/assets', () => {
    it('devrait créer un nouvel asset', async () => {
      const newAsset = {
        name: 'Test Asset',
        category: 'Servers',
        purchaseDate: '2023-01-01',
        status: 'operational',
        location: 'Data Center A',
      };

      const res = await request(app).post('/api/assets').send(newAsset).expect(201);

      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe('Test Asset');
      expect(res.body.status).toBe('operational');
    });

    it('devrait échouer si un champ requis est manquant', async () => {
      const asset = {
        category: 'Servers',
        purchaseDate: '2023-01-01',
        status: 'operational',
        location: 'DC1',
      };

      const res = await request(app).post('/api/assets').send(asset).expect(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  // ✅ TEST: Lecture
  describe('GET /api/assets', () => {
    it('devrait récupérer tous les assets', async () => {
      await Asset.insertMany([
        { name: 'A1', category: 'Laptops', purchaseDate: '2023-01-01', status: 'operational', location: 'Loc1' },
        { name: 'A2', category: 'Printers', purchaseDate: '2023-01-01', status: 'maintenance', location: 'Loc2' },
      ]);

      const res = await request(app).get('/api/assets').expect(200);
      expect(res.body.length).toBe(2);
    });
  });

  // ✅ TEST: Lecture par ID
  describe('GET /api/assets/:id', () => {
    it('devrait récupérer un asset par ID', async () => {
      const asset = await Asset.create({
        name: 'UniqueAsset',
        category: 'Monitors',
        purchaseDate: '2023-01-01',
        status: 'operational',
        location: 'HQ',
      });

      const res = await request(app).get(`/api/assets/${asset._id}`).expect(200);
      expect(res.body.name).toBe('UniqueAsset');
    });

    it('devrait retourner 404 si l\'asset n\'existe pas', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app).get(`/api/assets/${fakeId}`).expect(404);
    });

    it('devrait retourner 500 si l\'ID est invalide', async () => {
      await request(app).get('/api/assets/invalid-id').expect(500);
    });
  });

  // ✅ TEST: Mise à jour
  describe('PUT /api/assets/:id', () => {
    it('devrait mettre à jour un asset', async () => {
      const asset = await Asset.create({
        name: 'OldName',
        category: 'Phones',
        purchaseDate: '2023-01-01',
        status: 'operational',
        location: 'HQ',
      });

      const res = await request(app)
        .put(`/api/assets/${asset._id}`)
        .send({ name: 'NewName', status: 'maintenance' })
        .expect(200);

      expect(res.body.name).toBe('NewName');
      expect(res.body.status).toBe('maintenance');
    });

    it('devrait retourner 404 pour une mise à jour d\'asset inexistant', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app).put(`/api/assets/${fakeId}`).send({ name: 'X' }).expect(404);
    });
  });

  // ✅ TEST: Suppression
  describe('DELETE /api/assets/:id', () => {
    it('devrait supprimer un asset', async () => {
      const asset = await Asset.create({
        name: 'ToDelete',
        category: 'Storage',
        purchaseDate: '2023-01-01',
        status: 'operational',
        location: 'HQ',
      });

      await request(app).delete(`/api/assets/${asset._id}`).expect(200);

      const found = await Asset.findById(asset._id);
      expect(found).toBeNull();
    });

    it('devrait retourner 404 si l\'asset à supprimer n\'existe pas', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app).delete(`/api/assets/${fakeId}`).expect(404);
    });
  });

  // ✅ TEST: Statut invalide
  describe('Validation', () => {
    it('devrait rejeter un asset avec un statut invalide', async () => {
      const res = await request(app).post('/api/assets').send({
        name: 'Bad Status',
        category: 'Servers',
        purchaseDate: '2023-01-01',
        status: 'corrupted',
        location: 'Nowhere',
      }).expect(400);

      expect(res.body).toHaveProperty('error');
    });
  });

  // ✅ TEST: Simulation filtrage sans backend (on teste manuellement)
  describe('Filtrage manuel', () => {
    it('devrait permettre de filtrer localement les assets operational', async () => {
      await Asset.insertMany([
        { name: 'A1', category: 'Switches', purchaseDate: '2023-01-01', status: 'operational', location: 'DC1' },
        { name: 'A2', category: 'Switches', purchaseDate: '2023-01-01', status: 'maintenance', location: 'DC2' },
      ]);

      const res = await request(app).get('/api/assets').expect(200);
      const operational = res.body.filter(a => a.status === 'operational');

      expect(operational.length).toBe(1);
      expect(operational[0].name).toBe('A1');
    });
  });
});
