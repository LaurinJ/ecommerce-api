FROM node:17.2.0-alpine3.14 

ENV NODE_ENV=production

WORKDIR /backend

COPY ./package*.json /backend

RUN npm install --production

COPY ./ /backend

RUN mkdir /backend/invoices 
RUN mkdir /backend/images 
RUN mkdir /backend/images/profile 
RUN mkdir /backend/images/deliver 
RUN mkdir /backend/images/payment 


EXPOSE 4000

CMD [ "npm", "start" ]