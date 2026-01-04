const fs = require('fs');
const path = require('path');
const request = require('supertest');
let app;

describe('historico endpoint', () => {
  const tmpDir = fs.mkdtempSync(path.join(__dirname, 'tmp-his-'));
  const origDataDir = process.env.DATA_DIR;
  let token;

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

  test('POST /api/historico without pv or tipo returns 400', async () => {
    await request(app)
      .post('/api/historico')
      .set('Authorization', `Bearer ${token}`)
      .send({ pv: '', tipo: '' })
      .expect(400);
  });

  test('POST /api/historico with pv and tipo succeeds', async () => {
    const res = await request(app)
      .post('/api/historico')
      .set('Authorization', `Bearer ${token}`)
      .send({ pv: 123, tipo: 'venda' })
      .expect(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(Array.isArray(res.body.items)).toBe(true);
  });
});