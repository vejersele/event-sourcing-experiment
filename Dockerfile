FROM node:10.3.0

WORKDIR /app

ADD . .

RUN npm install --quit && npm run flow && npm run test:unit && npm run build

EXPOSE 3000

CMD ["npm", "start"]
