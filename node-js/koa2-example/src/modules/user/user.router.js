import Router from 'koa-router';

import UserController from './user.controller';
import { validator } from './../../middleware';
import { createSchema } from "./schemas";

const router = new Router({ prefix: '/api/user' });

export default router
  .get('/forbidden', UserController.error)
  .post('/', validator(createSchema), UserController.create)
  .routes();
