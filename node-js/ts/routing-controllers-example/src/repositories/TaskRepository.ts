import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { User } from './../models';
import { Task } from './../models';

@Service()
export class TaskRepository {

  @OrmRepository(User)
  private readonly userORMRepository: Repository<User>;

  @OrmRepository(Task)
  private readonly taskORMRepository: Repository<Task>;

  findAll(user: User): Promise<Task[]> {
    return this.taskORMRepository.find({ where: { user } });
  }
}
