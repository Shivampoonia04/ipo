const User = require('./User');
const Company = require('./Company');
const IPO = require('./IPO');
const ActivityLog = require('./ActivityLog');

// Define associations
Company.hasMany(IPO, { foreignKey: 'companyId', as: 'ipos' });
IPO.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

User.hasMany(ActivityLog, { foreignKey: 'userId', as: 'activityLogs' });
ActivityLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Company,
  IPO,
  ActivityLog
}; 