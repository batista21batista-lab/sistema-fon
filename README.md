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

---
✅ **Frontend** deployado no Netlify: https://sistema-fon.netlify.app/
⏳ **Backend** em desenvolvimento no Render

## Atualizações recentes
- 2026-01-03: Adicionado `backend/.env.example` (exemplo de variáveis de ambiente para desenvolvimento); corrigido `backend/Dockerfile` para expor a porta **3000**; criado workflow básico de CI (`.github/workflows/ci.yml`) com testes de smoke para `/api/health` e `/api/auth/login`.

### Como rodar os testes de integração localmente
No diretório `backend` rode:

```bash
npm ci
npm start &
npm run test:integration
```

O script `npm run test:integration` executa um fluxo de teste que verifica health, login, criação e exclusão de uma intermediação.

### Deploy automático do Frontend
Adicionei um workflow que publica a pasta `/frontend` na branch `gh-pages` sempre que houver push na `main` (`.github/workflows/deploy-frontend.yml`). Após o primeiro push, habilite GitHub Pages nas configurações do repositório (Settings > Pages) apontando para a branch `gh-pages` e pasta `/`.

### Publicar backend como imagem Docker (GHCR)
Adicionei um workflow para **build e publish** da imagem do backend para o GitHub Container Registry em `ghcr.io/${{ github.repository_owner }}/sistema-fon-backend` (`.github/workflows/docker-publish-backend.yml`). Para habilitar o fluxo automático:

- Verifique se `packages: write` está permitido para `GITHUB_TOKEN` (normalmente disponível).
- Para deploy manual, você pode puxar a imagem assim:

```bash
docker pull ghcr.io/<YOUR_ORG>/sistema-fon-backend:latest
docker run -e JWT_SECRET="seu-segredo" -e CORS_ORIGINS="https://seu-frontend" -e DATA_DIR=/data -p 3000:3000 ghcr.io/<YOUR_ORG>/sistema-fon-backend:latest
```

> Observação: para deploy em serviços como Render, Railway ou Docker Compose, use as variáveis listadas em `backend/.env.example`.

### Deploy automático para Render (via API)
Também adicionei um workflow que aciona um *deploy* no Render usando a API (`.github/workflows/deploy-backend-render.yml`). Para usar:

1. Crie um API key no Render (Account → API Keys) e copie o **Bearer token**.
2. No repositório GitHub, vá em **Settings → Secrets → Actions** e adicione duas secrets:
   - `RENDER_API_KEY` = seu token Bearer do Render
   - `RENDER_SERVICE_ID` = ID do serviço no Render (encontrado na URL do serviço ou nas configurações do serviço)
3. O workflow roda em pushes para `main` ou manualmente via *workflow_dispatch*. Ele:
   - chama `POST https://api.render.com/v1/services/{serviceId}/deploys` com `Authorization: Bearer <API_KEY>` para criar um deploy;
   - faz polling no deploy até `success` ou `failed` (timeout após ~5 minutos);
   - falha o job se o deploy falhar.

> Observação: este workflow apenas dispara e monitora o deploy no Render — para criação inicial do serviço (env vars, build command, disk persistente) recomendamos usar a interface do Render ou automações específicas da plataforma.

> Dica: Se preferir Railway, eu posso adicionar um workflow equivalente quando você me confirmar os detalhes de API/Secrets que deseja usar.

> Dica: se preferir Netlify, mantenha o deploy manual ou configure integração automática no Netlify (recomendado para controle de domínio e TLS).

## Atualização: 2025-12-19 02:05 AM
- Frontend publicado com sucesso
- Publish directory configurado para `/frontend`

Contribuições são bem-vindas! Faça um fork, crie uma branch e envie um pull request.
