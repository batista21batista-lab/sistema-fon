const fs = require('fs');
const path = require('path');
const request = require('supertest');
let app;

describe('intermediacoes endpoints', () => {
  const tmpDir = fs.mkdtempSync(path.join(__dirname, 'tmp-int-'));
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

  test('POST /api/intermediacoes creates an item', async () => {
    const payload = { valor: 150, descricao: 'teste' };
    const res = await request(app)
      .post('/api/intermediacoes')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(res.body).toHaveProperty('item');
    expect(res.body.item).toHaveProperty('id');
    createdId = res.body.item.id;
  });

  test('GET /api/intermediacoes returns created item', async () => {
    const res = await request(app)
      .get('/api/intermediacoes')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.find(x => x.id === createdId)).toBeTruthy();
  });

  test('PUT /api/intermediacoes/:id updates item', async () => {
    const res = await request(app)
      .put(`/api/intermediacoes/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ descricao: 'alterado' })
      .expect(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(res.body.item).toHaveProperty('descricao', 'alterado');
  });

  test('DELETE /api/intermediacoes/:id removes item and subsequent delete 404', async () => {
    await request(app)
      .delete(`/api/intermediacoes/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app)
      .delete(`/api/intermediacoes/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  test('unauthorized access is rejected', async () => {
    await request(app).get('/api/intermediacoes').expect(401);
  });
});