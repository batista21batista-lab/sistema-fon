# Checklist de Publicação - sistema-fon

Passos recomendados para publicar o projeto em produção (frontend + backend).

## Frontend (Netlify / GitHub Pages)
- [ ] Verificar `frontend/index.html` e ajustar `API URL` em Configuração após deploy.
- [ ] Publicar a pasta `/frontend` no Netlify (arrastar pasta ou conectar repo). Certifique-se de usar `Publish directory` = `/frontend`.
- [ ] Ou configurar GitHub Pages: Settings > Pages > Deploy from branch `main` > Folder `/frontend`.
- [ ] Testar página pública e validar conexão com backend (Configuração > Testar conexão).

## Backend (Render / Railway / Docker)
- [ ] Criar serviço no Render/Railway apontando para o repo.
- [ ] Definir variáveis de ambiente (exemplos em `backend/.env.example`):
  - `JWT_SECRET` (obrigatório em produção)
  - `CORS_ORIGINS` (origens permitidas)
  - `DATA_DIR` (diretório persistente)
  - `PORT` (opcional, padrão 3000)
- [ ] Conceder disco persistente (Render: mount directory /var/data ou similar).
- [ ] Testar endpoints públicos: `/api/health` e `POST /api/auth/login`.

## CI / QA
- [ ] Workflow básico de smoke tests já presente em `.github/workflows/ci.yml` (GET /api/health e login).
- [ ] (Opcional) Adicionar testes de integração e e2e adicionais conforme necessário.

## Observações finais
- Não comitar arquivos com credenciais (`.env` está no `.gitignore`).
- Atualize `README.md` com a URL pública do frontend e do backend após deploy.

---
Feito por: GitHub Copilot
