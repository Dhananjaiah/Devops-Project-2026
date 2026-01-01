FROM node:18-alpine AS build

WORKDIR /app

COPY package.json ./

RUN npm install

COPY tsconfig.json tsconfig.node.json vite.config.ts index.html ./
COPY src ./src

RUN npm run build

FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist
COPY server.js ./server.js

EXPOSE 8080

CMD ["npm", "start"]
