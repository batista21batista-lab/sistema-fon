# sistema-fon

## Fluxo Operacional de Negocios

Sistema completo de gestão de intermediações imobiliárias com frontend em HTML/JavaScript puro e backend em Node.js/Express.

## 🎯 Características

- **Frontend**: HTML5, CSS3, JavaScript vanilla (sem dependências)
- **Backend**: Node.js + Express + JWT + Bcrypt
- **Banco de Dados**: JSON com backup automático
- **Autenticação**: JWT com refresh tokens
- **CORS**: Configurável por ambiente

## 📁 Estrutura do Projeto

```
sistema-fon/
├── frontend/
│   └── index.html          # Aplicação completa em um único arquivo
├── backend/
│   ├── server.js           # Servidor Express principal
│   ├── db.js              # Gerenciamento de persistência JSON
│   ├── package.json       # Dependências Node.js
│   └── .env.example       # Exemplo de configuração
└── README.md
```

## 🚀 Como Publicar

### 1️⃣ Frontend (Netlify ou GitHub Pages)

**Opção A: Netlify (Recomendado)**
1. Acesse [netlify.com](https://netlify.com)
2. Faça login ou crie conta
3. Arraste a pasta `frontend/` (com o arquivo `index.html`) para publicar
4. Copie a URL gerada (ex: `seu-app.netlify.app`)

**Opção B: GitHub Pages**
1. Vá para Settings > Pages
2. Selecione "Deploy from a branch"
3. Escolha `main` e pasta `/frontend`
4. GitHub criará a URL automaticamente

### 2️⃣ Backend (Render ou Railway)

**Opção A: Render.com (Recomendado)**
1. Acesse [render.com](https://render.com)
2. Clique em "New +" > "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     JWTSECRET=seu-segredo-aleatorio-bem-grande
     CORSORIGINS=https://seu-app.netlify.app,https://seu-app.github.io
     DATADIR=/var/data
     ```
5. Adicione **Persistent Disk** montado em `/var/data`
6. Deploy automático ao fazer push

**Opção B: Railway.app**
1. Acesse [railway.app](https://railway.app)
2. Novo projeto > GitHub
3. Selecione o repositório
4. Defina variáveis de ambiente
5. Deploy

## 🔧 Desenvolvimento Local

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm start
# Servidor rodará em http://localhost:3000
```

### Frontend

```bash
# Simplesmente abra o arquivo em um navegador
open frontend/index.html

# Ou use um servidor local (Python)
python -m http.server 8000
# Acesse http://localhost:8000/frontend/
```

## 🔐 Credenciais Padrão

**Modo Local (localStorage):**
- Admin: `admin@fon.com.br` / `admin123`
- Gerente: `gerente@fon.com.br` / `gerente123`

## 📡 Configurar Backend no Frontend

Após publicar o backend, configure a URL no frontend:
1. Abra a aplicação
2. Vá em **Configuração**
3. Preencha "URL do Backend" (ex: `https://seu-backend.onrender.com`)
4. Clique em "Testar conexão" para validar
5. O sistema passará a usar o servidor remoto

## 💾 Backup de Dados

- **Modo Local**: Dados salvos no `localStorage` do navegador
- **Modo Online**: Backup automático diário em `/var/data/backups/`
- **Export Manual**: Acesse Configuração > Exportar CSV/JSON

## 📊 Funcionalidades

- Dashboard com métricas em tempo real
- Cadastro de intermediações com múltiplos beneficiários
- Gerenciamento financeiro com participações
- Calculadora de taxas e comissões
- Top corretores e análise de performance
- Projeção de vendas
- Gerenciamento de despesas recorrentes
- Exportação de dados (CSV, JSON, PDF)
- Histórico de alterações

## 🛠️ Troubleshooting

**"Falha ao conectar no backend"**
- Verifique a URL (sem `/api`)
- Confirme as variáveis CORSORIGINS
- Teste o health check: `GET https://seu-backend.com/api/health`

**"Dados desapareceram"**
- Se em modo local, verificar se limpou cache
- Se em modo online, verificar se o servidor tem disco persistente

## 📝 Licença

MIT - Sinta-se livre para usar, modificar e distribuir

## 🤝 Contribuições

Contribuições são bem-vindas! Faça um fork, crie uma branch e envie um pull request.
