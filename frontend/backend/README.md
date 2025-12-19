# Backend FON - API REST

Backend da aplicacao FON (Fluxo Operacional de Negocios)

## Instalacao

1. Navegar ate a pasta backend:
```bash
cd frontend/backend
```

2. Instalar dependencias:
```bash
npm install
```

## Configuracao

Crie um arquivo `.env` na raiz da pasta backend:
```
PORT=3000
NODE_ENV=development
```

## Execucao

Para iniciar o servidor em modo desenvolvimento:
```bash
npm run dev
```

Ou para iniciar em producao:
```bash
npm start
```

O servidor estara disponivel em `http://localhost:3000`

## Endpoints Disponiveis

### Dashboard
```
GET /api/dashboard
```
Retorna as metricas do dashboard (total intermediacoes, receita mes, clientes ativos).

### Intermediacoes
```
GET /api/intermediacoes
```
Retorna lista de intermediacoes imobiliarias.

### Financeiro
```
GET /api/financeiro
```
Retorna relatorios financeiros por mes.

### Health Check
```
GET /api/health
```
Verifica se o servidor esta rodando.

## Tecnologias Utilizadas

- Node.js
- Express.js
- CORS
- Helmet (Seguranca)
- Morgan (Logging)
- Dotenv (Variaveis de ambiente)

## Proximos Passos

- [ ] Conectar a banco de dados (MongoDB/PostgreSQL)
- [ ] Implementar autenticacao JWT
- [ ] Criar endpoints POST/PUT/DELETE
- [ ] Adicionar validacoes de dados
- [ ] Implementar testes unitarios
