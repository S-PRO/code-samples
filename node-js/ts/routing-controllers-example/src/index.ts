import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import * as parser from 'body-parser';

import * as controllers from './controllers';

(async function start() {
  try {
    const server = await createExpressServer({
      routePrefix: '/api',
      cors: true,
      defaultErrorHandler: true,
      middlewares: [parser({ limit: '100mb' })],
      controllers: Object.values(controllers),
    }).listen(8000);
  } catch (e) {
    throw new Error(e);
  }
})();
