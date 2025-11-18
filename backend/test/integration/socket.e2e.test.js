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
    socket.emit('join_conversation', { conversationId: 1 });
  });
  socket.on('new_message', () => (eventsReceived.new_message = true));
  socket.on('new_offer', () => (eventsReceived.new_offer = true));
  socket.on('appointment_scheduled', () => (eventsReceived.appointment_scheduled = true));
  // client listeners registered above

  // Wait for authentication then trigger HTTP actions and wait for all events
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      try { socket.disconnect(); } catch (e) {}
      reject(new Error('Timed out waiting for socket events'));
    }, 15000);

    const onAuthenticated = async () => {
      try {
        await api.post(`/api/messages`).set('Authorization', `Bearer ${token}`).send({ chatId: 1, content: 'hola socket' });
        await api.post(`/conversations/1/offers`).set('Authorization', `Bearer ${token}`).send({ amount: 1000 });
        await api.post(`/conversations/1/appointments`).set('Authorization', `Bearer ${token}`).send({ scheduledFor: new Date().toISOString() });

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
    };

    socket.once('joined_conversation', async () => {
      await new Promise((r) => setTimeout(r, 100));
      onAuthenticated();
    });
  });

  expect(eventsReceived.authenticated).toBe(true);
  expect(eventsReceived.new_message).toBe(true);
  expect(eventsReceived.new_offer).toBe(true);
  expect(eventsReceived.appointment_scheduled).toBe(true);
}, 30000);
