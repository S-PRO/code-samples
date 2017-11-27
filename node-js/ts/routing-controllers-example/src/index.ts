import 'reflect-metadata';
import { createExpressServer, useContainer as routingUseContainer } from 'routing-controllers';
import { createConnection, useContainer as ormUseContainer } from 'typeorm';
import * as parser from 'body-parser';
import { Container } from 'typedi';

import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from './config';

(async function start() {
  try {

    routingUseContainer(Container);
    ormUseContainer(Container);

    const conn = await createConnection({
      entities: [`${__dirname}/models/*.ts`],
      synchronize: true,
      type: 'mysql',
      host: DB_HOST,
      port: +DB_PORT,
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      logging: true,
    });

    await createExpressServer({
      routePrefix: '/api',
      cors: true,
      defaultErrorHandler: true,
      middlewares: [parser({ limit: '100mb' })],
      controllers: [`${__dirname}/controllers/*.ts`],
    }).listen(8000);
  } catch (e) {
    throw new Error(e);
  }
})();
