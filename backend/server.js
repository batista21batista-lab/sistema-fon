require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { readDB, writeDB } = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fon-secret-key-123';
const USERS = {
  'admin@fon.com.br': { passwordHash: bcrypt.hashSync('admin123', 10), name: 'Admin', role: 'Administrador' },
  'gerente@fon.com.br': { passwordHash: bcrypt.hashSync('gerente123', 10), name: 'Gerente', role: 'Gerente' }
};
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : '*' }));
app.use(morgan('combined'));
app.use(express.json());
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = USERS[email.toLowerCase()];
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) return res.status(401).json({ message: 'Credenciais inválidas' });
  const token = jwt.sign({ email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { email, name: user.name, role: user.role } });
});
app.get('/api/data', authenticateToken, (req, res) => res.json(readDB()));
app.post('/api/save', authenticateToken, (req, res) => { writeDB(req.body); res.json({ success: true }); });
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
