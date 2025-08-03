const express = require('express');
const jwt = require('jsonwebtoken');
const { User, ActivityLog } = require('../models');
const { validateLogin, handleValidationErrors } = require('../middleware/validation');
const { publicAuth, adminAuth } = require('../middleware/auth');
const activityLogger = require('../middleware/logger');

const router = express.Router();

// Admin Login
router.post('/login', 
  publicAuth,
  validateLogin,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ where: { email } });
      
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Verify password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Update last login
      await user.update({ lastLoginAt: new Date() });

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      // Log activity
      await ActivityLog.create({
        userId: user.id,
        action: 'LOGIN',
        endpoint: '/api/auth/login',
        method: 'POST',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        statusCode: 200
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          }
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// Logout (optional - client-side token removal)
router.post('/logout', 
  adminAuth,
  async (req, res) => {
    try {
      // Log activity
      await ActivityLog.create({
        userId: req.user.id,
        action: 'LOGOUT',
        endpoint: '/api/auth/logout',
        method: 'POST',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        statusCode: 200
      });

      res.json({
        success: true,
        message: 'Logout successful'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// Get current user info
router.get('/me', 
  adminAuth,
  async (req, res) => {
    try {
      res.json({
        success: true,
        data: {
          id: req.user.id,
          email: req.user.email,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          role: req.user.role,
          lastLoginAt: req.user.lastLoginAt
        }
      });

    } catch (error) {
      console.error('Get user info error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

module.exports = router; 