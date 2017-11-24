import Boom from 'boom';
import { models } from './../../db';

export default class UserController {

  static async create(ctx, next) {
    const { first_name, last_name } = ctx.request.body;
    const user = await models.user.create({ first_name, last_name });
    ctx.body = user;
  }

  static async update(ctx) {
    const { first_name, last_name } = ctx.request.body;
    const { id } = ctx.params;

    const user = await models.user.findOne({ where: { id } });
    if (!user) throw Boom.notFound();
    
    ctx.body = await user.update({ first_name, last_name });
  }

  static async error() {
    throw Boom.forbidden();
  }

};
