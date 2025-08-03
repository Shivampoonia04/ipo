const { ActivityLog } = require('../models');

const activityLogger = (action) => {
  return async (req, res, next) => {
    try {
      await ActivityLog.create({
        userId: req.user?.id,
        action,
        endpoint: req.originalUrl,
        ipAddress: req.ip
      });
    } catch (error) {
      console.error('Logging failed:', error);
    }
    next();
  };
};

module.exports = activityLogger;