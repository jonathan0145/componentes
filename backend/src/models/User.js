const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'buyer' },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  emailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  emailVerificationCode: { type: DataTypes.STRING, allowNull: true },
  emailVerificationExpires: { type: DataTypes.DATE, allowNull: true },
  phone: { type: DataTypes.STRING },
  avatar: { type: DataTypes.STRING },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = User;
