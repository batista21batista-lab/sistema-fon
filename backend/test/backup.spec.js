const fs = require('fs');
const path = require('path');
const request = require('supertest');
let app;

describe('backup endpoint', () => {
  const tmpDir = fs.mkdtempSync(path.join(__dirname, 'tmp-back-'));
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

  test('POST /api/backup generates a backup', async () => {
    const res = await request(app)
      .post('/api/backup')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty('ok', true);
    // verify a backup file exists in backups dir
    const backupsDir = path.join(tmpDir, 'fon', 'backups');
    const files = fs.existsSync(backupsDir) ? fs.readdirSync(backupsDir) : [];
    expect(files.length).toBeGreaterThanOrEqual(1);
  });
});