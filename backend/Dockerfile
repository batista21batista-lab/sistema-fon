FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# O servidor Node usa a porta 3000 por padrão (CONFIG via PORT env)
EXPOSE 3000
CMD ["node", "server.js"]
