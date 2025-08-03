const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { IPO } = require('../models');
const { validateId, handleValidationErrors } = require('../middleware/validation');
const { publicAuth, adminAuth } = require('../middleware/auth');
const { uploadRHP, uploadDRHP, uploadProspectus, handleUploadError } = require('../middleware/upload');
const activityLogger = require('../middleware/logger');

const router = express.Router();

// Upload RHP document (Admin only)
router.post('/:id/upload/rhp', 
  adminAuth,
  validateId,
  handleValidationErrors,
  uploadRHP,
  handleUploadError,
  async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const ipo = await IPO.findByPk(id);
      if (!ipo) {
        // Delete uploaded file if IPO doesn't exist
        await fs.unlink(req.file.path);
        return res.status(404).json({
          success: false,
          message: 'IPO not found'
        });
      }

      // Delete old file if exists
      if (ipo.rhpPath) {
        try {
          await fs.unlink(path.join(process.env.UPLOAD_PATH || './uploads', ipo.rhpPath));
        } catch (error) {
          console.error('Error deleting old RHP file:', error);
        }
      }

      // Update IPO with new file path
      await ipo.update({ rhpPath: req.file.filename });

      // Log activity
      await activityLogger('UPLOAD_RHP')(req, res, () => {});

      res.json({
        success: true,
        message: 'RHP document uploaded successfully',
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size
        }
      });

    } catch (error) {
      console.error('Upload RHP error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// Upload DRHP document (Admin only)
router.post('/:id/upload/drhp', 
  adminAuth,
  validateId,
  handleValidationErrors,
  uploadDRHP,
  handleUploadError,
  async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const ipo = await IPO.findByPk(id);
      if (!ipo) {
        // Delete uploaded file if IPO doesn't exist
        await fs.unlink(req.file.path);
        return res.status(404).json({
          success: false,
          message: 'IPO not found'
        });
      }

      // Delete old file if exists
      if (ipo.drhpPath) {
        try {
          await fs.unlink(path.join(process.env.UPLOAD_PATH || './uploads', ipo.drhpPath));
        } catch (error) {
          console.error('Error deleting old DRHP file:', error);
        }
      }

      // Update IPO with new file path
      await ipo.update({ drhpPath: req.file.filename });

      // Log activity
      await activityLogger('UPLOAD_DRHP')(req, res, () => {});

      res.json({
        success: true,
        message: 'DRHP document uploaded successfully',
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size
        }
      });

    } catch (error) {
      console.error('Upload DRHP error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// Upload Prospectus document (Admin only)
router.post('/:id/upload/prospectus', 
  adminAuth,
  validateId,
  handleValidationErrors,
  uploadProspectus,
  handleUploadError,
  async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const ipo = await IPO.findByPk(id);
      if (!ipo) {
        // Delete uploaded file if IPO doesn't exist
        await fs.unlink(req.file.path);
        return res.status(404).json({
          success: false,
          message: 'IPO not found'
        });
      }

      // Delete old file if exists
      if (ipo.prospectusPath) {
        try {
          await fs.unlink(path.join(process.env.UPLOAD_PATH || './uploads', ipo.prospectusPath));
        } catch (error) {
          console.error('Error deleting old prospectus file:', error);
        }
      }

      // Update IPO with new file path
      await ipo.update({ prospectusPath: req.file.filename });

      // Log activity
      await activityLogger('UPLOAD_PROSPECTUS')(req, res, () => {});

      res.json({
        success: true,
        message: 'Prospectus document uploaded successfully',
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size
        }
      });

    } catch (error) {
      console.error('Upload prospectus error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// Download RHP document (Public)
router.get('/:id/download/rhp', 
  publicAuth,
  validateId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const ipo = await IPO.findByPk(id);
      if (!ipo || !ipo.isActive) {
        return res.status(404).json({
          success: false,
          message: 'IPO not found'
        });
      }

      if (!ipo.rhpPath) {
        return res.status(404).json({
          success: false,
          message: 'RHP document not available'
        });
      }

      const filePath = path.join(process.env.UPLOAD_PATH || './uploads', ipo.rhpPath);
      
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: 'Document file not found'
        });
      }

      res.download(filePath, `RHP_${ipo.ipoName}.pdf`);

    } catch (error) {
      console.error('Download RHP error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// Download DRHP document (Public)
router.get('/:id/download/drhp', 
  publicAuth,
  validateId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const ipo = await IPO.findByPk(id);
      if (!ipo || !ipo.isActive) {
        return res.status(404).json({
          success: false,
          message: 'IPO not found'
        });
      }

      if (!ipo.drhpPath) {
        return res.status(404).json({
          success: false,
          message: 'DRHP document not available'
        });
      }

      const filePath = path.join(process.env.UPLOAD_PATH || './uploads', ipo.drhpPath);
      
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: 'Document file not found'
        });
      }

      res.download(filePath, `DRHP_${ipo.ipoName}.pdf`);

    } catch (error) {
      console.error('Download DRHP error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// Download Prospectus document (Public)
router.get('/:id/download/prospectus', 
  publicAuth,
  validateId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const ipo = await IPO.findByPk(id);
      if (!ipo || !ipo.isActive) {
        return res.status(404).json({
          success: false,
          message: 'IPO not found'
        });
      }

      if (!ipo.prospectusPath) {
        return res.status(404).json({
          success: false,
          message: 'Prospectus document not available'
        });
      }

      const filePath = path.join(process.env.UPLOAD_PATH || './uploads', ipo.prospectusPath);
      
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: 'Document file not found'
        });
      }

      res.download(filePath, `Prospectus_${ipo.ipoName}.pdf`);

    } catch (error) {
      console.error('Download prospectus error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// Delete document (Admin only)
router.delete('/:id/delete-doc', 
  adminAuth,
  validateId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { documentType } = req.body; // 'rhp', 'drhp', 'prospectus'

      if (!['rhp', 'drhp', 'prospectus'].includes(documentType)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid document type'
        });
      }

      const ipo = await IPO.findByPk(id);
      if (!ipo) {
        return res.status(404).json({
          success: false,
          message: 'IPO not found'
        });
      }

      const fieldMap = {
        rhp: 'rhpPath',
        drhp: 'drhpPath',
        prospectus: 'prospectusPath'
      };

      const fieldName = fieldMap[documentType];
      const filePath = ipo[fieldName];

      if (!filePath) {
        return res.status(404).json({
          success: false,
          message: `${documentType.toUpperCase()} document not found`
        });
      }

      // Delete file from filesystem
      try {
        await fs.unlink(path.join(process.env.UPLOAD_PATH || './uploads', filePath));
      } catch (error) {
        console.error(`Error deleting ${documentType} file:`, error);
      }

      // Update IPO record
      await ipo.update({ [fieldName]: null });

      // Log activity
      await activityLogger(`DELETE_${documentType.toUpperCase()}`)(req, res, () => {});

      res.json({
        success: true,
        message: `${documentType.toUpperCase()} document deleted successfully`
      });

    } catch (error) {
      console.error('Delete document error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

module.exports = router; 