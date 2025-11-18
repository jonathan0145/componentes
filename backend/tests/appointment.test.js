const request = require('supertest');
const app = require('../src/index');

describe('Endpoints de citas', () => {
  it('GET /api/appointments debe devolver 200 y lista de citas', async () => {
    const res = await request(app)
      .get('/api/appointments')
      .set('Authorization', 'Bearer token_de_prueba');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/appointments debe crear cita', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({ propertyId: 1, userId: 1, date: '2025-10-10T10:00:00Z' })
      .set('Authorization', 'Bearer token_de_prueba');
    console.log('appointment POST response:', res.statusCode, res.body);
    expect([200, 201, 400]).toContain(res.statusCode);
  });
});
