FROM node:17.2.0-alpine3.14 

ENV NODE_ENV=production

WORKDIR /backend

COPY ./package*.json /backend

RUN npm install --production

COPY ./ /backend


EXPOSE 4000

CMD [ "npm", "start" ]