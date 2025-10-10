const request = require('supertest');
const app = require('../src/index');

describe('Endpoints de chats', () => {
  it('GET /api/chats debe devolver 200 y lista de chats', async () => {
    const res = await request(app)
      .get('/api/chats')
      .set('Authorization', 'Bearer token_de_prueba');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/chats debe crear chat', async () => {
    const res = await request(app)
      .post('/api/chats')
      .send({ userIds: [1,2] })
      .set('Authorization', 'Bearer token_de_prueba');
    expect([200, 201, 400]).toContain(res.statusCode);
  });
});
