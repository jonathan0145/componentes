const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Property = sequelize.define('Property', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.INTEGER, allowNull: false },
  address: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING },
  postalCode: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  propertyType: { type: DataTypes.STRING }, // Cambiado de type a propertyType
  status: { type: DataTypes.STRING, defaultValue: 'active' },
  // Features planos
  furnished: { type: DataTypes.BOOLEAN, defaultValue: false },
  petFriendly: { type: DataTypes.BOOLEAN, defaultValue: false },
  elevator: { type: DataTypes.BOOLEAN, defaultValue: false },
  balcony: { type: DataTypes.BOOLEAN, defaultValue: false },
  garden: { type: DataTypes.BOOLEAN, defaultValue: false },
  pool: { type: DataTypes.BOOLEAN, defaultValue: false },
  gym: { type: DataTypes.BOOLEAN, defaultValue: false },
  security: { type: DataTypes.BOOLEAN, defaultValue: false },
  airConditioning: { type: DataTypes.BOOLEAN, defaultValue: false },
  heating: { type: DataTypes.BOOLEAN, defaultValue: false },
  internet: { type: DataTypes.BOOLEAN, defaultValue: false },
  laundry: { type: DataTypes.BOOLEAN, defaultValue: false },
  bedrooms: { type: DataTypes.INTEGER },
  bathrooms: { type: DataTypes.INTEGER },
  area: { type: DataTypes.INTEGER },
  parkingSpaces: { type: DataTypes.INTEGER },
  images: { type: DataTypes.JSON },
  sellerId: { type: DataTypes.INTEGER, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Property;
