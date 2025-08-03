const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Company extends Model {}

Company.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sector: {
    type: DataTypes.STRING,
    allowNull: true
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  foundedYear: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  headquarters: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, { 
  sequelize, 
  modelName: 'Company',
  timestamps: true
});

module.exports = Company; 