FROM node:9

WORKDIR /var/www/safe-js

ADD package.json package.json
ADD package-lock.json package-lock.json

RUN npm install

COPY . /var/www/safe-js
RUN npm run build

EXPOSE 8000

CMD ["node", "./build/index.js"]
