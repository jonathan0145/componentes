const db = require('../src/models');
const { userBelongsToConversation } = require('../src/utils/conversationUtils');

describe('userBelongsToConversation', () => {
  let user1, user2, user3, property1, property2, property3, chat1, chat2, chat3;
  beforeAll(async () => {
    // Sufijo único para emails
    const unique = Date.now() + '-' + Math.floor(Math.random() * 10000);
    // Sincronizar todos los modelos para respetar relaciones
    await db.sequelize.sync({ force: true });
    // Crear roles requeridos
    await db.Role.bulkCreate([
      { name: 'buyer', description: 'Buyer role' },
      { name: 'seller', description: 'Seller role' },
      { name: 'agent', description: 'Agent role' },
      { name: 'admin', description: 'Admin role' }
    ]);
    // Crear usuarios con el campo 'role' explícito
    user1 = await db.User.create({ name: 'Vendedor 1', email: `v1-${unique}@x.com`, password: '123', role: 'seller' });
    user2 = await db.User.create({ name: 'Vendedor 2', email: `v2-${unique}@x.com`, password: '123', role: 'seller' });
    user3 = await db.User.create({ name: 'Vendedor 3', email: `v3-${unique}@x.com`, password: '123', role: 'seller' });
    property1 = await db.Property.create({
      title: 'Propiedad 1',
      price: 1000,
      sellerId: user1.id
    });
    property2 = await db.Property.create({
      title: 'Propiedad 2',
      price: 2000,
      sellerId: user2.id
    });
    property3 = await db.Property.create({
      title: 'Propiedad 3',
      price: 3000,
      sellerId: user3.id
    });
    chat1 = await db.Chat.create({
      id: 'conv-1',
      participants: [user1.id, user2.id],
      propertyId: property1.id,
      buyerId: user1.id,
      sellerId: user2.id,
      status: 'active'
    });
    chat2 = await db.Chat.create({
      id: 'chat-1',
      participants: [user2.id, user3.id],
      propertyId: property2.id,
      buyerId: user2.id,
      sellerId: user3.id,
      status: 'active'
    });
    chat3 = await db.Chat.create({
      id: 'conv-2',
      propertyId: property3.id,
      buyerId: user1.id,
      sellerId: user3.id,
      status: 'active'
    });
  });
  afterAll(async () => {
    // Limpiar tablas relevantes y cerrar conexión
    await db.Chat.destroy({ where: {} });
    await db.Property.destroy({ where: {} });
    await db.User.destroy({ where: {} });
    await db.sequelize.close();
  });

  it('debe retornar true si el usuario está en participants (Conversation simulado)', async () => {
  const result = await userBelongsToConversation(user1.id, 'conv-1');
  expect(result).toBe(true);
  });

  it('debe retornar false si el usuario NO está en participants (Conversation simulado)', async () => {
  const result = await userBelongsToConversation(99, 'conv-1');
  expect(result).toBe(false);
  });

  it('debe retornar true si el usuario está en participants (Chat)', async () => {
  const result = await userBelongsToConversation(user3.id, 'chat-1');
  expect(result).toBe(true);
  });

  it('debe retornar false si el usuario NO está en participants (Chat)', async () => {
  const result = await userBelongsToConversation(99, 'chat-1');
  expect(result).toBe(false);
  });

  it('debe retornar true si el usuario es buyerId o sellerId', async () => {
  const result1 = await userBelongsToConversation(user1.id, 'conv-2');
  const result2 = await userBelongsToConversation(user3.id, 'conv-2');
  expect(result1).toBe(true);
  expect(result2).toBe(true);
  });

  it('debe retornar false si el usuario no es buyerId ni sellerId', async () => {
  const result = await userBelongsToConversation(99, 'conv-2');
  expect(result).toBe(false);
  });
});















