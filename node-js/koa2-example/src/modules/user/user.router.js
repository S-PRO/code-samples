import Router from 'koa-router';

import UserController from './user.controller';

const router = new Router({ prefix: '/api/user' });

router.post('/test', UserController.test);

export default router.routes();
