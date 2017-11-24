import Router from 'koa-router';

import TaskController from './task.controller';
import { validator } from './../../middleware';
// import { createSchema, updateSchema } from "./schemas";

const router = new Router({ prefix: '/api/task' });

export default router
  .get('/', TaskController.fetchAll)
  .get('/:id', TaskController.fetchOne)
  .routes();
