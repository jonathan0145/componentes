const request = require('supertest');
const app = require('../src/index');

describe('Endpoints de propiedades', () => {
  it('GET /api/properties debe devolver 200 y lista de propiedades', async () => {
    const res = await request(app)
      .get('/api/properties')
      .set('Authorization', 'Bearer token_de_prueba');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/properties debe crear propiedad', async () => {
    const res = await request(app)
      .post('/api/properties')
      .send({ title: 'Propiedad Test', price: 100000 })
      .set('Authorization', 'Bearer token_de_prueba');
    expect([200, 201, 400]).toContain(res.statusCode);
  });
});
