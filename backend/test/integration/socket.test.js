const request = require('supertest');
const ioClient = require('socket.io-client');
const { createTestServer } = require('../../src/testServer');
const { sequelize, Role, Property, Chat } = require('../../src/models');

let serverObj;
let api;
let port = 4001;

beforeAll(async () => {
  serverObj = await createTestServer();
  const address = serverObj.server.address();
  port = address.port || port;
  api = request(`http://localhost:${port}`);
  // seed roles (evita constraints FK al registrar usuarios)
  await Role.bulkCreate([
    { name: 'buyer', description: 'Buyer role' },
    { name: 'seller', description: 'Seller role' },
    { name: 'agent', description: 'Agent role' },
    { name: 'admin', description: 'Admin role' }
  ]).catch(() => {});
});

afterAll(async () => {
  if (serverObj && serverObj.close) await serverObj.close();
  await sequelize.close();
});

test('socket authentication and new_message/new_offer/appointment_scheduled flow', async () => {
  // register and login
  const registerRes = await api.post('/api/auth/register').send({ name: 'Test User', email: 'test@example.com', password: 'password' });
  expect([200, 201]).toContain(registerRes.status);
  console.log('[TEST] registerRes.body:', registerRes.body);

  const loginRes = await api.post('/api/auth/login').send({ email: 'test@example.com', password: 'password' });
  expect(loginRes.status).toBe(200);
  const token = loginRes.body.token;
  console.log('[TEST] loginRes.body:', loginRes.body);

  // Buscar el usuario por email para asegurar el id correcto
  const user = await require('../../src/models').User.findOne({ where: { email: 'test@example.com' } });
  const userId = user ? user.id : 1;
  console.log('[TEST] userId usado en propiedad/chat:', userId);

  const property = await Property.create({
    title: 'Test Property',
    price: 100000,
    sellerId: userId
  }).catch((err) => { console.log('[TEST] Error al crear propiedad:', err && err.message, err && err.errors); return null; });

  let chat = null;
  try {
    chat = await Chat.create({
      propertyId: property ? property.id : null,
      buyerId: userId,
      sellerId: userId,
      participants: [userId]
    });
  } catch (err) {
    console.log('[TEST] Error al crear chat:', err && err.message, err && err.errors);
  }
  const conversationId = chat ? chat.id : 1;
  console.log('[TEST] chat creado:', chat && chat.toJSON ? chat.toJSON() : chat);

  // connect socket client
  const socket = ioClient.connect(`http://localhost:${port}`, {
    transports: ['websocket'],
    forceNew: true,
    reconnection: false
  });

  const eventsReceived = { authenticated: false, new_message: false, new_offer: false, appointment_scheduled: false };

  socket.on('connect', () => socket.emit('authenticate', { token }));
  socket.on('authenticated', () => {
    eventsReceived.authenticated = true;
    socket.emit('join_conversation', { conversationId });
  });
  socket.on('new_message', (msg) => {
    console.log('[SOCKET][TEST] new_message recibido:', msg);
    eventsReceived.new_message = true;
  });
  socket.on('new_offer', (offer) => {
    console.log('[SOCKET][TEST] new_offer recibido:', offer);
    eventsReceived.new_offer = true;
  });
  socket.on('appointment_scheduled', (appt) => {
    console.log('[SOCKET][TEST] appointment_scheduled recibido:', appt);
    eventsReceived.appointment_scheduled = true;
  });
  // client listeners registered above

  // Trigger HTTP actions after authentication and wait for events
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      try { socket.disconnect(); } catch (e) {}
      reject(new Error('Timed out waiting for socket events'));
    }, 15000);

      socket.once('joined_conversation', async () => {
        // small delay to ensure server processed the join
        await new Promise((r) => setTimeout(r, 100));
      try {
  await api.post(`/api/messages`).set('Authorization', `Bearer ${token}`).send({ chatId: conversationId, content: 'hola socket' });
  await api.post(`/conversations/${conversationId}/offers`).set('Authorization', `Bearer ${token}`).send({ amount: 1000 });
  await api.post(`/conversations/${conversationId}/appointments`).set('Authorization', `Bearer ${token}`).send({ scheduledFor: new Date().toISOString() });

        const interval = setInterval(() => {
          if (eventsReceived.authenticated && eventsReceived.new_message && eventsReceived.new_offer && eventsReceived.appointment_scheduled) {
            clearInterval(interval);
            clearTimeout(timeout);
            try { socket.disconnect(); } catch (e) {}
            resolve();
          }
        }, 100);
      } catch (err) {
        clearTimeout(timeout);
        try { socket.disconnect(); } catch (e) {}
        reject(err);
      }
    });
  });

  expect(eventsReceived.authenticated).toBe(true);
  expect(eventsReceived.new_message).toBe(true);
  expect(eventsReceived.new_offer).toBe(true);
  expect(eventsReceived.appointment_scheduled).toBe(true);
}, 30000);
