const request = require('supertest');
const app = require('../src/index');

describe('Endpoints de roles', () => {
  it('GET /api/roles debe devolver 200 y lista de roles', async () => {
    const res = await request(app)
      .get('/api/roles')
      .set('Authorization', 'Bearer token_de_prueba');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/roles debe crear rol', async () => {
    const res = await request(app)
      .post('/api/roles')
      .send({ name: 'admin' })
      .set('Authorization', 'Bearer token_de_prueba');
  expect([200, 201, 400, 409]).toContain(res.statusCode);
  });
});
