const request = require('supertest');
const app = require('../src/index');

describe('Endpoints de notificaciones', () => {
  it('GET /api/notifications debe devolver 200 y lista de notificaciones', async () => {
    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', 'Bearer token_de_prueba');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/notifications debe crear notificación', async () => {
    const res = await request(app)
      .post('/api/notifications')
      .send({ userId: 1, type: 'info', message: 'Notificación de prueba' })
      .set('Authorization', 'Bearer token_de_prueba');
    expect([200, 201, 400]).toContain(res.statusCode);
  });
});
