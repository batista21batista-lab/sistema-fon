FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# O servidor Node usa a porta 3000 por padrão (CONFIG via PORT env)
EXPOSE 3000# Healthcheck para verificar se a API responde
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD curl -f http://localhost:3000/api/health || exit 1CMD ["node", "server.js"]
