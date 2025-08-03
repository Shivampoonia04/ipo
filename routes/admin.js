const express = require('express');
const { Op } = require('sequelize');
const { IPO, Company, ActivityLog, User } = require('../models');
const { adminAuth } = require('../middleware/auth');
const activityLogger = require('../middleware/logger');

const router = express.Router();

// Get admin dashboard stats
router.get('/stats', 
  adminAuth,
  async (req, res) => {
    try {
      const [
        totalIPOs,
        totalCompanies,
        activeIPOs,
        upcomingIPOs,
        recentIPOs,
        recentLogins
      ] = await Promise.all([
        IPO.count({ where: { isActive: true } }),
        Company.count({ where: { status: 'active' } }),
        IPO.count({ where: { status: 'open', isActive: true } }),
        IPO.count({ where: { status: 'upcoming', isActive: true } }),
        IPO.findAll({
          where: { isActive: true },
          limit: 5,
          order: [['createdAt', 'DESC']],
          include: [{
            model: Company,
            as: 'company',
            attributes: ['name']
          }]
        }),
        User.findAll({
          where: { 
            lastLoginAt: { [Op.not]: null },
            isActive: true 
          },
          limit: 5,
          order: [['lastLoginAt', 'DESC']],
          attributes: ['id', 'email', 'firstName', 'lastName', 'lastLoginAt']
        })
      ]);

      // Get status distribution
      const statusDistribution = await IPO.findAll({
        where: { isActive: true },
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status']
      });

      res.json({
        success: true,
        data: {
          totalIPOs,
          totalCompanies,
          activeIPOs,
          upcomingIPOs,
          recentIPOs,
          recentLogins,
          statusDistribution
        }
      });

    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// Get activity logs
router.get('/logs', 
  adminAuth,
  async (req, res) => {
    try {
      const { page = 1, limit = 50, action, userId, startDate, endDate } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {};

      if (action) {
        whereClause.action = action;
      }

      if (userId) {
        whereClause.userId = userId;
      }

      if (startDate && endDate) {
        whereClause.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      const { count, rows: logs } = await ActivityLog.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          as: 'user',
          attributes: ['email', 'firstName', 'lastName']
        }]
      });

      res.json({
        success: true,
        data: logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      });

    } catch (error) {
      console.error('Get logs error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// Get system health
router.get('/health', 
  adminAuth,
  async (req, res) => {
    try {
      const dbStatus = await sequelize.authenticate();
      
      res.json({
        success: true,
        data: {
          database: dbStatus ? 'connected' : 'disconnected',
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Health check error:', error);
      res.status(500).json({
        success: false,
        message: 'System health check failed'
      });
    }
  }
);

module.exports = router;