describe('userBelongsToConversation', () => {
const db = require('../src/models');
const { userBelongsToConversation } = require('../src/utils/conversationUtils');

describe('userBelongsToConversation', () => {
  beforeAll(async () => {
    // Sincronizar la base de datos en memoria
    await db.sequelize.sync({ force: true });
    // Usar Chat para simular Conversation
    await db.Chat.create({
      id: 'conv-1',
      participants: ['user-1', 'user-2']
    });
    await db.Chat.create({
      id: 'chat-1',
      participants: ['user-3', 'user-4']
    });
    await db.Chat.create({
      id: 'conv-2',
      buyerId: 'user-5',
      sellerId: 'user-6'
    });
  });

  afterAll(async () => {
    await db.Chat.destroy({ where: {} });
    await db.sequelize.close();
  });

  it('debe retornar true si el usuario está en participants (Conversation simulado)', async () => {
    const result = await userBelongsToConversation('user-1', 'conv-1');
    expect(result).toBe(true);
  });

  it('debe retornar false si el usuario NO está en participants (Conversation simulado)', async () => {
    const result = await userBelongsToConversation('user-x', 'conv-1');
    expect(result).toBe(false);
  });

  it('debe retornar true si el usuario está en participants (Chat)', async () => {
    const result = await userBelongsToConversation('user-3', 'chat-1');
    expect(result).toBe(true);
  });

  it('debe retornar false si el usuario NO está en participants (Chat)', async () => {
    const result = await userBelongsToConversation('user-x', 'chat-1');
    expect(result).toBe(false);
  });

  it('debe retornar true si el usuario es buyerId o sellerId', async () => {
    const result1 = await userBelongsToConversation('user-5', 'conv-2');
    const result2 = await userBelongsToConversation('user-6', 'conv-2');
    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });

  it('debe retornar false si el usuario no es buyerId ni sellerId', async () => {
    const result = await userBelongsToConversation('user-x', 'conv-2');
    expect(result).toBe(false);
  });
});
