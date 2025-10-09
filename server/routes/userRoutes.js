
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Get all users (Protected - Admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }
    
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific user
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register a new user
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      role: role || 'USER',
      department: department || 'General'
    });

    const newUser = await user.save();
    
    // Return user without password
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      status: newUser.status,
      lastLogin: newUser.lastLogin,
      token: generateToken(newUser._id)
    };
    
    res.status(201).json({ user: userResponse });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a user
router.patch('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin or updating their own profile
    if (req.user.role !== 'ADMIN' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password; // Will be hashed via middleware
    
    // Only allow admins to update these fields
    if (req.user.role === 'ADMIN') {
      if (req.body.role) user.role = req.body.role;
      if (req.body.department) user.department = req.body.department;
      if (req.body.status) user.status = req.body.status;
    }

    const updatedUser = await user.save();
    const userResponse = { ...updatedUser._doc };
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a user (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to delete users' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// User login with better error handling
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for:', email);
    
    // Check for user email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Update last login time
    user.lastLogin = Date.now();
    await user.save();
    
    console.log('Login successful for:', email);
    
    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        status: user.status,
        token: generateToken(user._id)
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  try {
    res.json({ message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user profile
router.get('/profile/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
