import Router from 'koa-router';
import UserController from './user.controller';

const router = new Router({ prefix: '/api/user' });

export default router
  .get('/forbidden', UserController.error)
  .post('/test', UserController.test)
  .routes();
