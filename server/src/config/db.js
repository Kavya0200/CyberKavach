const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers to avoid Windows querySrv ECONNREFUSED on local ISPs
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {
  // Use default OS resolvers if not permitted
}

// In-memory / cache fallback store in case MongoDB is not yet connected
const inMemoryStore = {
  reports: new Map(),
  isConnected: false
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.log('[Database] ⚠️  No MONGODB_URI set in server/.env.');
    console.log('[Database] ⚡ Operating in local resilient store mode (zero-crash fallback).');
    console.log('[Database] ℹ️  To connect MongoDB: Add MONGODB_URI to server/.env');
    inMemoryStore.isConnected = false;
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    inMemoryStore.isConnected = true;
    console.log(`[Database] ✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] ⚠️  MongoDB connection failed (${error.message}).`);
    console.log('[Database] ⚡ Running in resilient fallback mode so application remains fully operational.');
    inMemoryStore.isConnected = false;
  }
};

module.exports = { connectDB, inMemoryStore };
