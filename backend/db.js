const fs = require('fs');
const path = require('path');
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
const defaultData = { intermediacoes: [], despesas: [], historicoPV: [], config: {} };
function readDB() {
  if (!fs.existsSync(DB_FILE)) { fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2)); return defaultData; }
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')); } catch (e) { return defaultData; }
}
function writeDB(data) {
  try { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); createBackup(); } catch (e) { console.error(e); }
}
function createBackup() {
  try {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const backupFile = path.join(BACKUP_DIR, `backup-${dateStr}-${timeStr}.json`);
    fs.copyFileSync(DB_FILE, backupFile);
    const files = fs.readdirSync(BACKUP_DIR).filter(f => f.startsWith('backup-')).sort().reverse();
    if (files.length > 30) files.slice(30).forEach(f => fs.unlinkSync(path.join(BACKUP_DIR, f)));
  } catch (e) { console.error(e); }
}
module.exports = { readDB, writeDB };
