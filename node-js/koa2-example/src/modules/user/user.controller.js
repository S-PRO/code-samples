import Boom from 'boom';
import models from './../../db/models';

export default class UserController {

  static async create(ctx, next) {
    const { first_name, last_name } = ctx.request.body;
    const user = await models.user.create({ first_name, last_name });
    ctx.body = user;
  }

  static async error() {
    throw Boom.forbidden();
  }

};
