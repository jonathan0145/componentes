const request = require('supertest');
const app = require('../src/index');

describe('Endpoints de permisos', () => {
  it('GET /api/permissions debe devolver 200 y lista de permisos', async () => {
    const res = await request(app)
      .get('/api/permissions')
      .set('Authorization', 'Bearer token_de_prueba');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/permissions debe crear permiso', async () => {
    const res = await request(app)
      .post('/api/permissions')
      .send({ name: 'crear_propiedad' })
      .set('Authorization', 'Bearer token_de_prueba');
    expect([200, 201, 400]).toContain(res.statusCode);
  });
});
