FROM node:10

WORKDIR /app

COPY src src

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm ci

EXPOSE 4000
ENTRYPOINT ["npm", "start"]