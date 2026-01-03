const fs = require('fs');
const path = require('path');
let app;
const request = require('supertest');

describe('routes (http)', () => {
  const tmpDir = fs.mkdtempSync(path.join(__dirname, 'tmp-'));
  const origDataDir = process.env.DATA_DIR;
  let token;

  beforeAll(async () => {
    process.env.DATA_DIR = tmpDir;
    // clear possible cached require
    delete require.cache[require.resolve('../server')];
    app = require('../server');
  });

  afterAll(() => {
    process.env.DATA_DIR = origDataDir;
    // cleanup temp files
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('GET /api/health returns status ok', async () => {
    const res = await request(app).get('/api/health').expect(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('time');
  });

  test('POST /api/auth/login returns token for admin', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@fon.com.br', senha: 'admin123' })
      .expect(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    token = res.body.token;
  });

  test('GET /api/intermediacoes without auth returns 401', async () => {
    await request(app).get('/api/intermediacoes').expect(401);
  });

  test('GET /api/intermediacoes with auth returns array', async () => {
    const res = await request(app)
      .get('/api/intermediacoes')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
  });
});