 const request = require('supertest');
const ioClient = require('socket.io-client');
const { createTestServer } = require('../../src/testServer');
const { sequelize, Role } = require('../../src/models');

let serverObj;
let api;
let port = 4001;

beforeAll(async () => {
  serverObj = await createTestServer();
  const address = serverObj.server.address();
  port = address.port || port;
  api = request(`http://localhost:${port}`);
  // seed roles
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

test('socket authentication and new_message/new_offer/appointment_scheduled flow (e2e)', async () => {
  // register and login
  const registerRes = await api.post('/api/auth/register').send({ name: 'Test User', email: 'test@example.com', password: 'password' });
  expect([200, 201]).toContain(registerRes.status);
  const loginRes = await api.post('/api/auth/login').send({ email: 'test@example.com', password: 'password' });
  expect(loginRes.status).toBe(200);
  const token = loginRes.body.token;

  // Crear propiedad y chat para obtener un conversationId real (UUID)
  // Buscar el usuario por email para asegurar el id correcto
  const user = await require('../../src/models').User.findOne({ where: { email: 'test@example.com' } });
  const userId = user ? user.id : 1;
  const property = await require('../../src/models').Property.create({
    title: 'Test Property',
    price: 100000,
    sellerId: userId
  });
  let chat = null;
  try {
    chat = await require('../../src/models').Chat.create({
      propertyId: property ? property.id : null,
      buyerId: userId,
      sellerId: userId,
      participants: [userId]
    });
  } catch (err) {
    console.log('[TEST] Error al crear chat:', err && err.message, err && err.errors);
  }
  const conversationId = chat ? chat.id : 1;

  // connect socket client with reconnection disabled to avoid post-test reconnect attempts
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

  // Wait for authentication then trigger HTTP actions and wait for all events
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      try { socket.disconnect(); } catch (e) {}
      reject(new Error('Timed out waiting for socket events'));
    }, 15000);

    socket.once('joined_conversation', async () => {
      await new Promise((r) => setTimeout(r, 100));
      try {
        await api.post(`/api/messages`).set('Authorization', `Bearer ${token}`).send({ chatId: conversationId, content: 'hola socket' });
        await api.post(`/conversations/${conversationId}/offers`).set('Authorization', `Bearer ${token}`).send({ amount: 1000 });
        await api.post(`/conversations/${conversationId}/appointments`).set('Authorization', `Bearer ${token}`).send({ scheduledFor: new Date().toISOString() });

        const check = setInterval(() => {
          if (eventsReceived.authenticated && eventsReceived.new_message && eventsReceived.new_offer && eventsReceived.appointment_scheduled) {
            clearInterval(check);
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
