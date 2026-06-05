FROM node:24-alpine

WORKDIR /app

# Crear carpeta uploads
RUN mkdir -p /app/uploads && chmod 777 /app/uploads

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
