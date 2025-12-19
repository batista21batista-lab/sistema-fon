const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Dados simulados para desenvolvimento
const dadosDashboard = {
  metricas: {
    totalIntermediacao: 45,
    receitaMes: 125000.50,
    clientesAtivos: 12
  }
};

const dadosIntermediacoes = [
  { id: 1, descricao: 'Venda Imovel A', valor: 50000, status: 'Concluido' },
  { id: 2, descricao: 'Venda Imovel B', valor: 75000, status: 'Pendente' },
  { id: 3, descricao: 'Aluguel Imovel C', valor: 3500, status: 'Ativo' }
];

const dadosFinanceiro = {
  relatorios: [
    { mes: 'Janeiro', valor: 25000 },
    { mes: 'Fevereiro', valor: 28500 },
    { mes: 'Marco', valor: 32000 },
    { mes: 'Abril', valor: 30500 },
    { mes: 'Maio', valor: 35000 },
    { mes: 'Junho', valor: 39000 }
  ]
};

// Rotas da API
app.get('/api/dashboard', (req, res) => {
  res.json(dadosDashboard);
});

app.get('/api/intermediacoes', (req, res) => {
  res.json(dadosIntermediacoes);
});

app.get('/api/financeiro', (req, res) => {
  res.json(dadosFinanceiro);
});

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend FON rodando com sucesso!' });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({ message: 'API FON - Backend', version: '1.0.0' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor FON rodando em http://localhost:${PORT}`);
  console.log('Endpoints disponiveis:');
  console.log('  GET /api/dashboard');
  console.log('  GET /api/intermediacoes');
  console.log('  GET /api/financeiro');
  console.log('  GET /api/health');
});

module.exports = app;
