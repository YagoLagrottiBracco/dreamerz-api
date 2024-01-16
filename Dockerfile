FROM node:18-alpine
WORKDIR /usr/src/api
RUN addgroup api && adduser -S -G api api
USER api
COPY package.json .
USER root
RUN chown -R api:api /usr/src/api
USER api
RUN npm install
COPY . .
CMD ["npm", "start"]