const { body, param, query, validationResult } = require('express-validator');

// Validation rules
const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
];

const validateCompany = [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('description').optional().trim(),
  body('sector').optional().trim(),
  body('website').optional().isURL(),
  body('foundedYear').optional().isInt({ min: 1800, max: new Date().getFullYear() }),
  body('headquarters').optional().trim()
];

const validateIPO = [
  body('companyId').isInt({ min: 1 }),
  body('ipoName').trim().isLength({ min: 2, max: 200 }),
  body('openDate').isISO8601(),
  body('closeDate').isISO8601(),
  body('priceRange').optional().trim(),
  body('lotSize').optional().isInt({ min: 1 }),
  body('totalShares').optional().isInt({ min: 1 }),
  body('issueSize').optional().isFloat({ min: 0 }),
  body('faceValue').optional().isFloat({ min: 0 }),
  body('exchange').optional().trim(),
  body('registrar').optional().trim(),
  body('leadManager').optional().trim(),
  body('description').optional().trim()
];

const validateId = [
  param('id').isInt({ min: 1 })
];

const validateSearch = [
  query('q').optional().trim().isLength({ min: 2 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
];

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateLogin,
  validateCompany,
  validateIPO,
  validateId,
  validateSearch,
  handleValidationErrors
}; 