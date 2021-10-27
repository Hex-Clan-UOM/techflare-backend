FROM node:17-alpine3.14
WORKDIR /app
COPY package.json /app
RUN npm install -g npm@latest
RUN npm install --only=prod && npm cache clean --force
COPY . /app
EXPOSE 8080
CMD npm start
