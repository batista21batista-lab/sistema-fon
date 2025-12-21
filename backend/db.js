const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

function getDataRoot() {
  const root = process.env.DATA_DIR || path.join(process.cwd(), 'data');
  return root;
}

function getPaths() {
  const root = getDataRoot();
  const fonDir = path.join(root, 'fon');
  const dbFile = path.join(fonDir, 'db.json');
  const backupDir = path.join(fonDir, 'backups');
  return { root, fonDir, dbFile, backupDir };
}

async function ensureDirs() {
  const { fonDir, backupDir } = getPaths();
  await fsp.mkdir(fonDir, { recursive: true });
  await fsp.mkdir(backupDir, { recursive: true });
}

function defaultDB() {
  return {
    meta: { createdAt: new Date().toISOString() },
    intermediacoes: [],
    despesas: [],
    historicoPV: []
  };
}

async function readDB() {
  await ensureDirs();
  const { dbFile } = getPaths();
  try {
    const raw = await fsp.readFile(dbFile, 'utf-8');
    const data = JSON.parse(raw);
    if (!data.intermediacoes) data.intermediacoes = [];
    if (!data.despesas) data.despesas = [];
    if (!data.historicoPV) data.historicoPV = [];
    if (!data.meta) data.meta = { createdAt: new Date().toISOString() };
    return data;
  } catch (e) {
    const db = defaultDB();
    await writeDB(db);
    return db;
  }
}

async function writeDB(db) {
  await ensureDirs();
  const { dbFile } = getPaths();
  const tmp = dbFile + '.tmp';
  const payload = JSON.stringify(db, null, 2);
  await fsp.writeFile(tmp, payload, 'utf-8');
  await fsp.rename(tmp, dbFile);
}

function ymd() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function createBackup() {
  await ensureDirs();
  const { dbFile, backupDir } = getPaths();
  if (!fs.existsSync(dbFile)) {
    await writeDB(defaultDB());
  }
  const filename = `db-${ymd()}.json`;
  const dest = path.join(backupDir, filename);
  if (!fs.existsSync(dest)) {
    await fsp.copyFile(dbFile, dest);
  }
  const files = (await fsp.readdir(backupDir))
    .filter(f => f.startsWith('db-') && f.endsWith('.json'))
    .sort();
  const extra = files.length - 30;
  if (extra > 0) {
    const toDelete = files.slice(0, extra);
    for (const f of toDelete) {
      try {
        await fsp.unlink(path.join(backupDir, f));
      } catch {}
    }
  }
}

module.exports = { getPaths, readDB, writeDB, createBackup };
