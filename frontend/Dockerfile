FROM node:24-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Expor a porta do Vite
EXPOSE 8080

# Comando para rodar em desenvolvimento
CMD ["npm", "run", "dev", "--", "--watch"]
