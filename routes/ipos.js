const express = require('express');
const { Op } = require('sequelize');
const { IPO, Company } = require('../models');
const { validateIPO, validateId, validateSearch, handleValidationErrors } = require('../middleware/validation');
const { publicAuth, adminAuth } = require('../middleware/auth');
const activityLogger = require('../middleware/logger');

const router = express.Router();

// Get all IPOs (Public)
router.get('/', 
  publicAuth,
  validateSearch,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { page = 1, limit = 20, q, status, companyId } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {
        isActive: true
      };

      if (q) {
        whereClause[Op.or] = [
          { ipoName: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } },
          { exchange: { [Op.iLike]: `%${q}%` } }
        ];
      }

      if (status) {
        whereClause.status = status;
      }

      if (companyId) {
        whereClause.companyId = companyId;
      }

      const { count, rows: ipos } = await IPO.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['openDate', 'DESC']],
        include: [{
          model: Company,
          as: 'company',
          where: { status: 'active' },
          required: true
        }]
      });

      res.json({
        success: true,
        data: ipos,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      });

    } catch (error) {
      console.error('Get IPOs error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// Search IPOs by keyword (Public)
router.get('/search', 
  publicAuth,
  validateSearch,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { q, limit = 10 } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const ipos = await IPO.findAll({
        where: {
          isActive: true,
          [Op.or]: [
            { ipoName: { [Op.iLike]: `%${q}%` } },
            { description: { [Op.iLike]: `%${q}%` } },
            { exchange: { [Op.iLike]: `%${q}%` } }
          ]
        },
        limit: parseInt(limit),
        order: [['openDate', 'DESC']],
        include: [{
          model: Company,
          as: 'company',
          where: { status: 'active' },
          required: true
        }]
      });

      res.json({
        success: true,
        data: ipos
      });

    } catch (error) {
      console.error('Search IPOs error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// Get IPO by ID (Public)
router.get('/:id', 
  publicAuth,
  validateId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const ipo = await IPO.findOne({
        where: { id, isActive: true },
        include: [{
          model: Company,
          as: 'company',
          where: { status: 'active' },
          required: true
        }]
      });

      if (!ipo) {
        return res.status(404).json({
          success: false,
          message: 'IPO not found'
        });
      }

      res.json({
        success: true,
        data: ipo
      });

    } catch (error) {
      console.error('Get IPO error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// Create IPO (Admin only)
router.post('/', 
  adminAuth,
  validateIPO,
  handleValidationErrors,
  async (req, res) => {
    try {
      // Verify company exists
      const company = await Company.findByPk(req.body.companyId);
      if (!company || company.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'Invalid company ID'
        });
      }

      const ipo = await IPO.create(req.body);

      // Log activity
      await activityLogger('CREATE_IPO')(req, res, () => {});

      res.status(201).json({
        success: true,
        message: 'IPO created successfully',
        data: ipo
      });

    } catch (error) {
      console.error('Create IPO error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// Update IPO (Admin only)
router.put('/:id', 
  adminAuth,
  validateId,
  validateIPO,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const ipo = await IPO.findByPk(id);
      if (!ipo) {
        return res.status(404).json({
          success: false,
          message: 'IPO not found'
        });
      }

      // Verify company exists if companyId is being updated
      if (req.body.companyId) {
        const company = await Company.findByPk(req.body.companyId);
        if (!company || company.status !== 'active') {
          return res.status(400).json({
            success: false,
            message: 'Invalid company ID'
          });
        }
      }

      await ipo.update(req.body);

      // Log activity
      await activityLogger('UPDATE_IPO')(req, res, () => {});

      res.json({
        success: true,
        message: 'IPO updated successfully',
        data: ipo
      });

    } catch (error) {
      console.error('Update IPO error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// Delete IPO (Admin only)
router.delete('/:id', 
  adminAuth,
  validateId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const ipo = await IPO.findByPk(id);
      if (!ipo) {
        return res.status(404).json({
          success: false,
          message: 'IPO not found'
        });
      }

      await ipo.update({ isActive: false });

      // Log activity
      await activityLogger('DELETE_IPO')(req, res, () => {});

      res.json({
        success: true,
        message: 'IPO deleted successfully'
      });

    } catch (error) {
      console.error('Delete IPO error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

module.exports = router; 