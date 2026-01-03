require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cron = require('node-cron');
const { readDB, writeDB, createBackup, getPaths } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'DEV_ONLY_CHANGE_ME';
const TZ = process.env.TZ || 'America/Sao_Paulo';

function parseOrigins() {
  const raw = (process.env.CORS_ORIGINS || '').trim();
  if (!raw) return [];
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}
const allowedOrigins = parseOrigins();

app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));
app.use(cors({
  origin: function (origin, cb) {
    if (!origin) return cb(null, true);
    if (!allowedOrigins.length) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('CORS bloqueado para esta origem: ' + origin));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const users = [
  {
    email: 'admin@fon.com.br',
    nome: 'Admin',
    perfil: 'Administrador',
    senhaHash: bcrypt.hashSync(process.env.SEED_ADMIN_PASSWORD || 'admin123', 10)
  },
  {
    email: 'gerente@fon.com.br',
    nome: 'Gerente',
    perfil: 'Gerente',
    senhaHash: bcrypt.hashSync(process.env.SEED_MANAGER_PASSWORD || 'gerente123', 10)
  }
];

function signToken(user) {
  return jwt.sign(
    { email: user.email, perfil: user.perfil, nome: user.nome },
    JWT_SECRET,
    { expiresIn: '12h' }
  );
}

function auth(req, res, next) {
  const hdr = req.headers.authorization || '';
  const parts = hdr.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Token ausente.' });
  }
  try {
    const decoded = jwt.verify(parts[1], JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

function nowBR() {
  return new Date().toLocaleString('pt-BR', { timeZone: TZ });
}

function ensureId(item) {
  if (item.id) return item;
  item.id = String(Date.now()) + '-' + Math.floor(Math.random() * 100000);
  return item;
}

app.get('/api/health', async (req, res) => {
  const paths = getPaths();
  res.json({ status: 'ok', time: nowBR(), dataDir: paths.fonDir });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, senha } = req.body || {};
  const u = users.find(x => x.email === String(email || '').toLowerCase());
  if (!u) return res.status(401).json({ error: 'Email ou senha inválidos.' });
  const ok = bcrypt.compareSync(String(senha || ''), u.senhaHash);
  if (!ok) return res.status(401).json({ error: 'Email ou senha inválidos.' });
  const token = signToken(u);
  res.json({ token, user: { email: u.email, nome: u.nome, perfil: u.perfil } });
});

app.get('/api/intermediacoes', auth, async (req, res) => {
  const db = await readDB();
  res.json({ items: db.intermediacoes || [] });
});

app.post('/api/intermediacoes', auth, async (req, res) => {
  const db = await readDB();
  const item = ensureId({ ...req.body });
  db.intermediacoes = db.intermediacoes || [];
  db.intermediacoes.push(item);
  await writeDB(db);
  res.json({ ok: true, item });
});

app.put('/api/intermediacoes/:id', auth, async (req, res) => {
  const db = await readDB();
  const id = String(req.params.id);
  db.intermediacoes = db.intermediacoes || [];
  const idx = db.intermediacoes.findIndex(x => String(x.id) === id);
  if (idx < 0) return res.status(404).json({ error: 'Intermediação não encontrada.' });
  db.intermediacoes[idx] = { ...db.intermediacoes[idx], ...req.body, id };
  await writeDB(db);
  res.json({ ok: true, item: db.intermediacoes[idx] });
});

app.delete('/api/intermediacoes/:id', auth, async (req, res) => {
  const db = await readDB();
  const id = String(req.params.id);
  db.intermediacoes = db.intermediacoes || [];
  const before = db.intermediacoes.length;
  db.intermediacoes = db.intermediacoes.filter(x => String(x.id) !== id);
  if (db.intermediacoes.length === before) {
    return res.status(404).json({ error: 'Intermediação não encontrada.' });
  }
  await writeDB(db);
  res.json({ ok: true });
});

app.get('/api/despesas', auth, async (req, res) => {
  const db = await readDB();
  res.json({ items: db.despesas || [] });
});

app.post('/api/despesas', auth, async (req, res) => {
  const db = await readDB();
  const item = ensureId({ ...req.body });
  db.despesas = db.despesas || [];
  db.despesas.push(item);
  await writeDB(db);
  res.json({ ok: true, item });
});

app.put('/api/despesas/:id', auth, async (req, res) => {
  const db = await readDB();
  const id = String(req.params.id);
  db.despesas = db.despesas || [];
  const idx = db.despesas.findIndex(x => String(x.id) === id);
  if (idx < 0) return res.status(404).json({ error: 'Despesa não encontrada.' });
  db.despesas[idx] = { ...db.despesas[idx], ...req.body, id };
  await writeDB(db);
  res.json({ ok: true, item: db.despesas[idx] });
});

app.delete('/api/despesas/:id', auth, async (req, res) => {
  const db = await readDB();
  const id = String(req.params.id);
  db.despesas = db.despesas || [];
  const before = db.despesas.length;
  db.despesas = db.despesas.filter(x => String(x.id) !== id);
  if (db.despesas.length === before) {
    return res.status(404).json({ error: 'Despesa não encontrada.' });
  }
  await writeDB(db);
  res.json({ ok: true });
});

app.get('/api/historico', auth, async (req, res) => {
  const db = await readDB();
  res.json({ items: db.historicoPV || [] });
});

app.post('/api/historico', auth, async (req, res) => {
  const { pv, tipo } = req.body || {};
  if (!pv || !tipo) return res.status(400).json({ error: 'Informe pv e tipo.' });
  const db = await readDB();
  db.historicoPV = db.historicoPV || [];
  db.historicoPV.push({
    id: String(Date.now()) + '-' + Math.floor(Math.random() * 100000),
    pv: Number(pv),
    tipo: String(tipo),
    usuario: req.user && req.user.email ? req.user.email : 'desconhecido',
    dataHora: nowBR()
  });
  await writeDB(db);
  res.json({ ok: true, items: db.historicoPV });
});

app.post('/api/backup', auth, async (req, res) => {
  try {
    await createBackup();
    res.json({ ok: true, message: 'Backup gerado com sucesso.' });
  } catch (e) {
    res.status(500).json({ error: 'Falha ao gerar backup: ' + e.message });
  }
});

cron.schedule('0 3 * * *', async () => {
  try {
    await createBackup();
    console.log('[BACKUP] OK -', nowBR());
  } catch (e) {
    console.error('[BACKUP] ERRO -', e.message);
  }
}, { timezone: TZ });

app.listen(PORT, async () => {
  console.log(`FON backend rodando na porta ${PORT}`);
  console.log('CORS_ORIGINS:', allowedOrigins.length ? allowedOrigins : '(liberado geral)');
  console.log('DATA_DIR:', process.env.DATA_DIR || '(local ./data)');
  try {
    await createBackup();
  } catch {}
});
