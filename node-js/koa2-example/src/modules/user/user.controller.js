import Boom from 'boom';

export default class UserController {
  
    static async test(ctx) {
      ctx.status = 200;
      ctx.body = 'OK';
    }

    static async error() {
      throw Boom.forbidden();
    }
  
  };
  