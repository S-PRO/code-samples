import { JsonController, Get, Param, CurrentUser } from 'routing-controllers';
import { notFound } from 'boom';

import { User } from './../models';
import { UserRepository, TaskRepository } from './../repositories';

@JsonController('/user/:id/task')
export class UserController {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly taskRepository: TaskRepository
  ) { }

  @Get('/')
  fetchAll( @CurrentUser({ required: true }) user: User) {
    return this.taskRepository.findAll(user);
  }
}
