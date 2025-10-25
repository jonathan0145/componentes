const { sequelize } = require('../src/models');

module.exports = async () => {
  // Sync models before tests run
  try {
    await sequelize.sync({ force: true });
    console.log('Jest setup: DB sincronizada');
    // Seed roles and an admin user for tests
    const { Role, User } = require('../src/models');
    await Role.bulkCreate([
      { name: 'buyer', description: 'Buyer role' },
      { name: 'seller', description: 'Seller role' },
      { name: 'agent', description: 'Agent role' },
      { name: 'admin', description: 'Admin role' }
    ]).catch(() => {});
    // create admin user with id 1 and role 'admin'
  await User.create({ id: 1, email: 'admin@test.local', password: 'password', name: 'Admin', role: 'admin' }).catch(() => {});
  // create an additional seller user and property + chat for message/appointment tests
  await User.create({ id: 2, email: 'seller@test.local', password: 'password', name: 'Seller', role: 'seller' }).catch(() => {});
  const { Property, Chat } = require('../src/models');
  await Property.create({ id: 1, title: 'Test Property', price: 100000, address: 'Street 1', sellerId: 2 }).catch(() => {});
  await Chat.create({ id: 1, propertyId: 1, buyerId: 1, sellerId: 2, status: 'active' }).catch(() => {});
  } catch (e) {
    console.error('Jest setup error syncing DB:', e);
    throw e;
  }
};