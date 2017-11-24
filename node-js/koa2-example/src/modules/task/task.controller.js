import Boom from 'boom';
import { models } from './../../db';

export default class TaskController {

  static async fetchAll(ctx) {
    ctx.body = await models.task.findAll();
  }

  static async fetchOne(ctx) {
    const task = await models.task.findById(ctx.params.id);
    if (!task) throw Boom.notFound();
    ctx.body = task;
  }

};
