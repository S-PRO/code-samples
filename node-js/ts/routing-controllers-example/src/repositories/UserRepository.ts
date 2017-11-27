import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { User } from './../models';

@Service()
export class UserRepository {

  @OrmRepository(User)
  private readonly repository: Repository<User>;

  public findAll(): Promise<User[]> {
    return this.repository.find();
  }

  public findOne(id: number): Promise<User | undefined> {
    return this.repository.findOneById(id);
  }
}
