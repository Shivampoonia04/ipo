const express = require('express');
const { Op } = require('sequelize');
const { Company, IPO } = require('../models');
const { validateCompany, validateId, validateSearch, handleValidationErrors } = require('../middleware/validation');
const { publicAuth, adminAuth } = require('../middleware/auth');
const activityLogger = require('../middleware/logger');

const router = express.Router();

// Get all companies (Public)
router.get('/', 
  publicAuth,
  validateSearch,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { page = 1, limit = 20, q } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {
        status: 'active'
      };

      if (q) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${q}%` } },
          { sector: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } }
        ];
      }

      const { count, rows: companies } = await Company.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['name', 'ASC']],
        include: [{
          model: IPO,
          as: 'ipos',
          where: { isActive: true },
          required: false
        }]
      });

      res.json({
        success: true,
        data: companies,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      });

    } catch (error) {
      console.error('Get companies error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// Get company by ID (Public)
router.get('/:id', 
  publicAuth,
  validateId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const company = await Company.findOne({
        where: { id, status: 'active' },
        include: [{
          model: IPO,
          as: 'ipos',
          where: { isActive: true },
          required: false,
          order: [['openDate', 'DESC']]
        }]
      });

      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }

      res.json({
        success: true,
        data: company
      });

    } catch (error) {
      console.error('Get company error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// Create company (Admin only)
router.post('/', 
  adminAuth,
  validateCompany,
  handleValidationErrors,
  async (req, res) => {
    try {
      const company = await Company.create(req.body);

      // Log activity
      await activityLogger('CREATE_COMPANY')(req, res, () => {});

      res.status(201).json({
        success: true,
        message: 'Company created successfully',
        data: company
      });

    } catch (error) {
      console.error('Create company error:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Company with this name already exists'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// Update company (Admin only)
router.put('/:id', 
  adminAuth,
  validateId,
  validateCompany,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const company = await Company.findByPk(id);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }

      await company.update(req.body);

      // Log activity
      await activityLogger('UPDATE_COMPANY')(req, res, () => {});

      res.json({
        success: true,
        message: 'Company updated successfully',
        data: company
      });

    } catch (error) {
      console.error('Update company error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// Delete company (Admin only)
router.delete('/:id', 
  adminAuth,
  validateId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const company = await Company.findByPk(id);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }

      // Check if company has active IPOs
      const activeIPOs = await IPO.count({
        where: { companyId: id, isActive: true }
      });

      if (activeIPOs > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete company with active IPOs'
        });
      }

      await company.update({ status: 'inactive' });

      // Log activity
      await activityLogger('DELETE_COMPANY')(req, res, () => {});

      res.json({
        success: true,
        message: 'Company deleted successfully'
      });

    } catch (error) {
      console.error('Delete company error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

module.exports = router; 