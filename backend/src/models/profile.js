const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Profile = sequelize.define('Profile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: { model: 'Users', key: 'id' },
    onDelete: 'CASCADE',
  },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  avatar: { type: DataTypes.STRING },
  preferences: { type: DataTypes.JSON },
  // Campos profesionales para agentes/intermediarios
  licenseNumber: { type: DataTypes.STRING },
  agency: { type: DataTypes.STRING },
  experience: { type: DataTypes.STRING },
  specialization: { type: DataTypes.STRING },
  coverageArea: { type: DataTypes.STRING },
  showContactInfo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  receiveEmailNotifications: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

// Relación 1:1
User.hasOne(Profile, { foreignKey: 'userId', as: 'profile' });
Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Profile;
