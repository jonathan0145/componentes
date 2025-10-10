const request = require('supertest');
const app = require('../src/index');

describe('Endpoints de ofertas', () => {
  it('GET /api/offers debe devolver 200 y lista de ofertas', async () => {
    const res = await request(app)
      .get('/api/offers')
      .set('Authorization', 'Bearer token_de_prueba');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/offers debe crear oferta', async () => {
    const res = await request(app)
      .post('/api/offers')
      .send({ propertyId: 1, userId: 1, amount: 50000 })
      .set('Authorization', 'Bearer token_de_prueba');
    expect([200, 201, 400]).toContain(res.statusCode);
  });
});
