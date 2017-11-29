import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { User, Task } from './../models';

@Service()
export class TaskService {

  @OrmRepository(Task)
  private readonly taskORMRepository: Repository<Task>;

  public findAll(user: User): Promise<Task[]> {
    return this.taskORMRepository
      .createQueryBuilder()
      .select('*')
      .where({ user: user.id })
      .execute();
  }

  public async create(task: Task): Promise<Task | undefined> {
    await this.taskORMRepository.save(task);
    return task;
  }
}
