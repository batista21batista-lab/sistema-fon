const fs = require('fs');
const path = require('path');
const request = require('supertest');
let app;

describe('despesas endpoints', () => {
  const tmpDir = fs.mkdtempSync(path.join(__dirname, 'tmp-desp-'));
  const origDataDir = process.env.DATA_DIR;
  let token;
  let createdId;

  beforeAll(async () => {
    process.env.DATA_DIR = tmpDir;
    delete require.cache[require.resolve('../server')];
    app = require('../server');
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@fon.com.br', senha: 'admin123' })
      .expect(200);
    token = res.body.token;
  });

  afterAll(() => {
    process.env.DATA_DIR = origDataDir;
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('POST /api/despesas creates an item', async () => {
    const payload = { valor: 80, descricao: 'despesa teste' };
    const res = await request(app)
      .post('/api/despesas')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(res.body.item).toHaveProperty('id');
    createdId = res.body.item.id;
  });

  test('GET /api/despesas returns created item', async () => {
    const res = await request(app)
      .get('/api/despesas')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.find(x => x.id === createdId)).toBeTruthy();
  });

  test('PUT /api/despesas/:id updates item', async () => {
    const res = await request(app)
      .put(`/api/despesas/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ descricao: 'despesa alterada' })
      .expect(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(res.body.item).toHaveProperty('descricao', 'despesa alterada');
  });

  test('DELETE /api/despesas/:id removes item and subsequent delete 404', async () => {
    await request(app)
      .delete(`/api/despesas/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app)
      .delete(`/api/despesas/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});