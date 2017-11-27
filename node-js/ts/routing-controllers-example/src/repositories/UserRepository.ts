import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { User } from './../models';

@Service()
export class UserRepository {

  @OrmRepository(User) 
  private readonly repository: Repository<User>;

  findAll() {
    return this.repository.find();
  }
}
