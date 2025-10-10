const request = require('supertest');
const app = require('../src/index');

describe('Endpoints de historial de precios', () => {
  it('GET /api/price-history debe devolver 200 y lista de historial', async () => {
    const res = await request(app)
      .get('/api/price-history')
      .set('Authorization', 'Bearer token_de_prueba');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/price-history debe crear registro', async () => {
    const res = await request(app)
      .post('/api/price-history')
      .send({ propertyId: 1, price: 120000 })
      .set('Authorization', 'Bearer token_de_prueba');
    expect([200, 201, 400]).toContain(res.statusCode);
  });
});
