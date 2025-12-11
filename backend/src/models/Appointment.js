const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  propertyId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  notes: { type: DataTypes.STRING },
  time: { type: DataTypes.STRING }, // Hora de la cita (HH:mm)
  status: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending, confirmed, cancelled
  confirmationCode: { type: DataTypes.STRING, allowNull: true, unique: true, comment: 'Código único de confirmación para la cita' },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  confirmedAt: { type: DataTypes.DATE, allowNull: true },
  completedAt: { type: DataTypes.DATE, allowNull: true },
  cancelledAt: { type: DataTypes.DATE, allowNull: true },
  cancelReason: { type: DataTypes.STRING, allowNull: true }
});

module.exports = Appointment;
