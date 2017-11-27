FROM node:latest

RUN npm i -g typescript ts-node

WORKDIR /var/www/rc-api

ADD . /var/www/rc-api

RUN npm install

EXPOSE 8000

CMD ["docker/start.sh"]

