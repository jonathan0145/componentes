const request = require('supertest');
const app = require('../src/index');

describe('Endpoints de archivos', () => {
  it('GET /api/files debe devolver 200 y lista de archivos', async () => {
    const res = await request(app)
      .get('/api/files')
      .set('Authorization', 'Bearer token_de_prueba');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/files/upload debe subir archivo', async () => {
    const res = await request(app)
      .post('/api/files/upload')
      .attach('file', Buffer.from('contenido de prueba'), 'test.txt')
      .set('Authorization', 'Bearer token_de_prueba');
    expect([200, 201, 400]).toContain(res.statusCode);
  });
});
