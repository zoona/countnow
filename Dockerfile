FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000
ENV DATABASE_URL=postgresql://localhost:5432/countnow

CMD ["npm", "start"]


