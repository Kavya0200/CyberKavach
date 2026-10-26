const mongoose = require('mongoose');
const crypto = require('crypto');
const { inMemoryStore } = require('../config/db');

// In-memory store fallback for users
if (!inMemoryStore.users) {
  inMemoryStore.users = new Map();
}

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true },
    role: { type: String, enum: ['citizen', 'officer'], default: 'citizen' },
    phone: { type: String, default: '' },
    city: { type: String, default: '' }
  },
  { timestamps: true }
);

const MongoUser = mongoose.models.User || mongoose.model('User', UserSchema);

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

class UserRepository {
  static async create({ name, email, password, role = 'citizen', phone = '', city = '' }) {
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const normalizedEmail = email.toLowerCase().trim();

    if (inMemoryStore.isConnected) {
      try {
        const created = await MongoUser.create({
          name,
          email: normalizedEmail,
          passwordHash,
          salt,
          role,
          phone,
          city
        });
        return {
          id: created._id.toString(),
          name: created.name,
          email: created.email,
          role: created.role,
          phone: created.phone,
          city: created.city
        };
      } catch (err) {
        console.error('Mongo user write error, falling back to inMemoryStore:', err.message);
      }
    }

    const user = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name,
      email: normalizedEmail,
      passwordHash,
      salt,
      role,
      phone,
      city,
      createdAt: new Date()
    };
    inMemoryStore.users.set(normalizedEmail, user);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      city: user.city
    };
  }

  static async findByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();
    if (inMemoryStore.isConnected) {
      try {
        const found = await MongoUser.findOne({ email: normalizedEmail });
        if (found) return found;
      } catch (err) {
        console.error('Mongo user find error:', err.message);
      }
    }
    return inMemoryStore.users.get(normalizedEmail) || null;
  }

  static verifyPassword(user, password) {
    if (!user || !user.salt || !user.passwordHash) return false;
    const computedHash = hashPassword(password, user.salt);
    return computedHash === user.passwordHash;
  }
}

// Seed official Cyber Cell officer account if not present
async function seedDefaultUsers() {
  const officer = await UserRepository.findByEmail('officer@cyberkavach.gov.in');
  if (!officer) {
    await UserRepository.create({
      name: 'Duty Officer (Cyber Cell)',
      email: 'officer@cyberkavach.gov.in',
      password: 'police123',
      role: 'officer',
      phone: '+91 94220 11223',
      city: 'Central Cyber Police Station'
    });
  }
}

setTimeout(seedDefaultUsers, 1000);

module.exports = {
  MongoUser,
  UserRepository
};
