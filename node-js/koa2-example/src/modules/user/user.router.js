import Router from 'koa-router';

import UserController from './user.controller';
import { validator } from './../../middleware';
import { createSchema, updateSchema } from "./schemas";

const router = new Router({ prefix: '/api/user' });

export default router
  .get('/forbidden', UserController.error)
  .post('/', validator(createSchema), UserController.create)
  .put('/:id', validator(updateSchema), UserController.update)
  .routes();
