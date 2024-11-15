FROM node:18

WORKDIR /web

COPY package*.json ./

RUN npm install

COPY . .

CMD npm start