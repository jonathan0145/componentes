const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const uuidv4 = require('../utils/uuid');

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => uuidv4()
  },
  propertyId: { type: DataTypes.INTEGER, allowNull: false },
  buyerId: { type: DataTypes.INTEGER, allowNull: false },
  sellerId: { type: DataTypes.INTEGER, allowNull: false },
  intermediaryId: { type: DataTypes.INTEGER }, // Opcional
  participants: { type: DataTypes.JSON }, // Nuevo campo para compatibilidad con tests y lógica
  status: { type: DataTypes.STRING, defaultValue: 'active' }, // active, archived, closed
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Chat;
