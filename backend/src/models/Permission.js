const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Permission = sequelize.define('Permission', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roleId: { type: DataTypes.INTEGER, allowNull: false },
  action: { type: DataTypes.STRING, allowNull: false }, // e.g. 'create_property', 'send_message', 'make_offer'
  allowed: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Permission;
