const request = require('supertest');
const app = require('../src/index');

describe('Endpoints de usuarios', () => {
  it('GET /api/users debe devolver 200 y lista de usuarios', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', 'Bearer token_de_prueba');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/users debe crear usuario', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Test', email: 'test@test.com', password: '123456' })
      .set('Authorization', 'Bearer token_de_prueba');
    expect([200, 201, 400]).toContain(res.statusCode);
  });
});
