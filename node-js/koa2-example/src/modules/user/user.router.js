import Router from 'koa-router';

import UserController from './user.controller';
import { validator } from './../../middleware';
import { createSchema, updateSchema } from "./schemas";
import { crteaTaskSchema } from './../task/schemas';

const router = new Router({ prefix: '/api/user' });

export default router
  .get('/', UserController.fetchAll)
  .get('/:id', UserController.fetchOne)
  .post('/', validator(createSchema), UserController.create)
  .post('/:id/task', validator(crteaTaskSchema), UserController.createUserTask)
  .put('/:id', validator(updateSchema), UserController.update)
  .delete('/:id', UserController.remove)
  .routes();
