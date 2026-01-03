const fs = require('fs');
const path = require('path');
const { readDB, writeDB, createBackup } = require('../db');

describe('db backups and read error handling', () => {
  const tmpDir = fs.mkdtempSync(path.join(__dirname, 'tmp-'));
  const origDataDir = process.env.DATA_DIR;

  beforeAll(() => {
    process.env.DATA_DIR = tmpDir;
  });

  afterAll(() => {
    process.env.DATA_DIR = origDataDir;
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('readDB recovers from invalid JSON and writes default', async () => {
    const { dbFile } = require('../db').getPaths();
    // write invalid JSON
    fs.mkdirSync(path.dirname(dbFile), { recursive: true });
    fs.writeFileSync(dbFile, 'not-a-json', 'utf8');

    const data = await readDB();
    expect(data).toHaveProperty('intermediacoes');
    expect(Array.isArray(data.intermediacoes)).toBe(true);

    // file should now be valid JSON
    const raw = fs.readFileSync(dbFile, 'utf8');
    expect(() => JSON.parse(raw)).not.toThrow();
  });

  test('createBackup creates backup file and enforces retention', async () => {
    const { dbFile, backupDir } = require('../db').getPaths();
    // ensure db exists
    await writeDB({ intermediacoes: [] });

    fs.mkdirSync(backupDir, { recursive: true });
    // create 32 fake backup files (older ones should be deleted)
    for (let i = 0; i < 32; i++) {
      const name = `db-2025-01-${String(i + 1).padStart(2, '0')}.json`;
      fs.writeFileSync(path.join(backupDir, name), '{}', 'utf8');
    }

    // run createBackup which should add today and then trim to 30 files
    await createBackup();

    const files = fs.readdirSync(backupDir).filter(f => f.startsWith('db-') && f.endsWith('.json')).sort();
    expect(files.length).toBeLessThanOrEqual(30);

    // run createBackup again for same day (dest exists) and ensure no error and still <=30
    await createBackup();
    const files2 = fs.readdirSync(backupDir).filter(f => f.startsWith('db-') && f.endsWith('.json')).sort();
    expect(files2.length).toBeLessThanOrEqual(30);
  });
});