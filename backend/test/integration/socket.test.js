const request = require('supertest');
const ioClient = require('socket.io-client');
const { createTestServer } = require('../../src/testServer');
const { sequelize, Role, Property, Chat } = require('../../src/models');

let server;
let api;
let port = 4001;

beforeAll(async () => {
  server = await createTestServer();
  const address = server.address();
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
  if (server && server.close) await new Promise((res) => server.close(res));
  await sequelize.close();
});

test('socket authentication and new_message/new_offer/appointment_scheduled flow', async () => {
  // register and login
  const registerRes = await api.post('/api/auth/register').send({ name: 'Test User', email: 'test@example.com', password: 'password' });
  expect([200, 201]).toContain(registerRes.status);
  const loginRes = await api.post('/api/auth/login').send({ email: 'test@example.com', password: 'password' });
  expect(loginRes.status).toBe(200);
  const token = loginRes.body.token;

  // create a Property and Chat (avoid hard-coded ids)
  const property = await Property.create({ title: 'Test Property' }).catch(() => null);
  const chat = await Chat.create({ propertyId: property ? property.id : null }).catch(() => null);
  const conversationId = chat ? chat.id : 1;

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
  socket.on('new_message', () => (eventsReceived.new_message = true));
  socket.on('new_offer', () => (eventsReceived.new_offer = true));
  socket.on('appointment_scheduled', () => (eventsReceived.appointment_scheduled = true));

  // Trigger HTTP actions after authentication and wait for events
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      try { socket.disconnect(); } catch (e) {}
      reject(new Error('Timed out waiting for socket events'));
    }, 15000);

    socket.once('authenticated', async () => {
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
