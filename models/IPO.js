const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class IPO extends Model {}

IPO.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Companies',
      key: 'id'
    }
  },
  ipoName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  openDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  closeDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  priceRange: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lotSize: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  totalShares: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  issueSize: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  faceValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'open', 'closed', 'listed', 'cancelled'),
    defaultValue: 'upcoming'
  },
  rhpPath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  drhpPath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  prospectusPath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  exchange: {
    type: DataTypes.STRING,
    allowNull: true
  },
  registrar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  leadManager: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, { 
  sequelize, 
  modelName: 'IPO',
  timestamps: true
});

module.exports = IPO;