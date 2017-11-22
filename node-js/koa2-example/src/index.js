import fs from 'fs';

import Koa from 'koa';
import cors from 'koa-cors';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import convert from 'koa-convert';

import { CatchErrorMiddleware } from './middleware';

const API_PORT = 8000;
const app = new Koa();

app
  .use(CatchErrorMiddleware)
  .use(convert(cors({ origin: true })))
  .use(logger())
  .use(convert(bodyParser({ jsonLimit: '50mb' })));

fs.readdirSync(`${__dirname}/modules`).forEach(module => {
  try {
    const __module = require(`${__dirname}/modules/${module}/${module}.router.js`).default;
    app.use(__module);
    console.log(`loaded ${module} module`);
  } catch (e) {
    console.log(`Error, while loading ${module}`, e);
  }
});

app.listen(API_PORT, () => {
  console.log(`API IS RUNNING WITH ${process.env.NODE_ENV} env on PORT: ${API_PORT}`);
});
