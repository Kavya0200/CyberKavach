const express = require('express');
const router = express.Router();
const { UserRepository } = require('../models/User');

/**
 * POST /api/auth/register
 * Normal email & password citizen or officer registration
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'citizen', phone = '', city = '' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.'
      });
    }

    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email address already exists.'
      });
    }

    const user = await UserRepository.create({
      name,
      email,
      password,
      role: role === 'officer' ? 'officer' : 'citizen',
      phone,
      city
    });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/auth/login
 * Standard email & password authentication
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please enter both email and password.'
      });
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const isValid = UserRepository.verifyPassword(user, password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
