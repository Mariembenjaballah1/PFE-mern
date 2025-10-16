const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

async function connect() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    mongoServer = await MongoMemoryServer.create({
      startupTimeoutMS: 30000,
    });
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoMemoryServer started and mongoose connected');
  } catch (error) {
    console.error('Error starting MongoMemoryServer:', error);
    throw error;
  }
}

async function clearDatabase() {
  if (mongoose.connection.readyState === 1) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
}

async function closeDatabase() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('MongoMemoryServer stopped and mongoose disconnected');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

module.exports = { connect, clearDatabase, closeDatabase };
