FROM node:18

WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .


RUN npx prisma generate
RUN npm run build

RUN npm run prisma:seed


EXPOSE 3001

CMD ["node", "build/index.js"]
