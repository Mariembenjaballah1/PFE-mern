
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Store refresh tokens in memory (in production, use Redis or database)
const refreshTokens = new Set();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m'
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Refresh Token Endpoint
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ 
        success: false,
        message: 'Refresh token required' 
      });
    }
    
    // Check if refresh token exists in our store
    if (!refreshTokens.has(refreshToken)) {
      return res.status(403).json({ 
        success: false,
        message: 'Invalid refresh token' 
      });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Generate new tokens
    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    
    // Remove old refresh token and add new one
    refreshTokens.delete(refreshToken);
    refreshTokens.add(newRefreshToken);
    
    res.json({
      success: true,
      token: newToken,
      refreshToken: newRefreshToken,
      message: 'Token refreshed successfully'
    });
    
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(403).json({ 
      success: false,
      message: 'Invalid refresh token' 
    });
  }
});

// Logout Endpoint
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      // Remove refresh token from store
      refreshTokens.delete(refreshToken);
    }
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during logout' 
    });
  }
});

// Add refresh token to login (modify existing login to include refresh token storage)
router.post('/login-with-refresh', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for user email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
    
    // Update last login time
    user.lastLogin = Date.now();
    await user.save();
    
    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    
    // Store refresh token
    refreshTokens.add(refreshToken);
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        status: user.status,
        token: token
      },
      refreshToken: refreshToken
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
});

module.exports = router;
