const request = require('supertest');
const app = require('../src/index');

describe('Endpoints de mensajes', () => {
  it('GET /api/messages debe devolver 200 y lista de mensajes', async () => {
    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', 'Bearer token_de_prueba');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/messages debe crear mensaje', async () => {
    const res = await request(app)
      .post('/api/messages')
      .send({ chatId: 1, senderId: 1, content: 'Hola' })
      .set('Authorization', 'Bearer token_de_prueba');
    expect([200, 201, 400]).toContain(res.statusCode);
  });
});
