const fs = require('fs');
const path = require('path');
const { readDB, writeDB } = require('../db');

describe('db read/write', () => {
  const tmpDir = fs.mkdtempSync(path.join(__dirname, 'tmp-'));
  const origDataDir = process.env.DATA_DIR;
  beforeAll(() => {
    process.env.DATA_DIR = tmpDir;
  });
  afterAll(() => {
    process.env.DATA_DIR = origDataDir;
    // cleanup temp files
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('writeDB creates file and readDB reads it', async () => {
    const sample = { intermediacoes: [{ id: '1', valor: 100 }] };
    await writeDB(sample);
    const read = await readDB();
    expect(read).toMatchObject(sample);
  });
});
