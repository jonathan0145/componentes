const sequelize = require('../config/database');

const User = require('./User');
const Property = require('./Property');
const Offer = require('./Offer');
const Message = require('./Message');
const Notification = require('./Notification');
const Appointment = require('./Appointment');
const Chat = require('./Chat');
const PriceHistory = require('./PriceHistory');
const Verification = require('./Verification');
const Role = require('./Role');
const Permission = require('./Permission');
const File = require('./File');

// Relaciones principales
User.hasMany(Property, { foreignKey: 'sellerId' });
Property.belongsTo(User, { as: 'seller', foreignKey: 'sellerId' });

Property.hasMany(Offer, { foreignKey: 'propertyId' });
Offer.belongsTo(Property, { foreignKey: 'propertyId' });
Offer.belongsTo(User, { as: 'buyer', foreignKey: 'buyerId' });

Property.hasMany(PriceHistory, { foreignKey: 'propertyId' });
PriceHistory.belongsTo(Property, { foreignKey: 'propertyId' });

User.hasMany(Verification, { foreignKey: 'userId' });
Verification.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Appointment, { foreignKey: 'userId' });
Appointment.belongsTo(User, { foreignKey: 'userId' });
Property.hasMany(Appointment, { foreignKey: 'propertyId' });
Appointment.belongsTo(Property, { foreignKey: 'propertyId' });

// Chat y mensajes
Chat.hasMany(Message, { foreignKey: 'chatId' });
Message.belongsTo(Chat, { foreignKey: 'chatId' });
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Message.hasMany(File, { foreignKey: 'messageId' });
File.belongsTo(Message, { foreignKey: 'messageId' });

// Roles y permisos
Role.hasMany(Permission, { foreignKey: 'roleId' });
Permission.belongsTo(Role, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'role', targetKey: 'name' });

// Chat participantes
Chat.belongsTo(User, { as: 'buyer', foreignKey: 'buyerId' });
Chat.belongsTo(User, { as: 'seller', foreignKey: 'sellerId' });
Chat.belongsTo(User, { as: 'intermediary', foreignKey: 'intermediaryId' });

module.exports = {
  sequelize,
  User,
  Property,
  Offer,
  Message,
  Notification,
  Appointment,
  Chat,
  PriceHistory,
  Verification,
  Role,
  Permission,
  File,
  Profile: require('./profile')
};
