const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const File = sequelize.define('File', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  messageId: { type: DataTypes.INTEGER, allowNull: false },
  url: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING },
  size: { type: DataTypes.INTEGER },
  uploadedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = File;
