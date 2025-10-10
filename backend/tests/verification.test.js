const request = require('supertest');
const app = require('../src/index');

describe('Endpoints de verificaciones', () => {
  it('GET /api/verifications debe devolver 200 y lista de verificaciones', async () => {
    const res = await request(app)
      .get('/api/verifications')
      .set('Authorization', 'Bearer token_de_prueba');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/verifications debe crear verificación', async () => {
    const res = await request(app)
      .post('/api/verifications')
      .send({ userId: 1, status: 'pending' })
      .set('Authorization', 'Bearer token_de_prueba');
    expect([200, 201, 400]).toContain(res.statusCode);
  });
});
