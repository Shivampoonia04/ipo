const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: 'Access denied. No token provided.' 
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId);

      if (!user || !user.isActive) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token or user inactive.' 
        });
      }

      // Check role-based access
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. Insufficient permissions.' 
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }
  };
};

// Public routes - no authentication required
const publicAuth = (req, res, next) => {
  next();
};

// Admin only routes
const adminAuth = auth(['admin']);

// Optional authentication for public routes
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId);
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication for optional routes
    next();
  }
};

module.exports = {
  auth,
  publicAuth,
  adminAuth,
  optionalAuth
}; 