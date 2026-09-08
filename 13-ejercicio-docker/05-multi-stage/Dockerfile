# Etapa 1
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

# npm ci instala TODAS las dependencias, incluidas las devDependencies (esbuild)
RUN npm ci

COPY . .

RUN npm run build

# Etapa 2
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

USER node

CMD ["node", "dist/server.js"]
