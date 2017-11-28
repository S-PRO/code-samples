import { JsonController, Get, Post, Param, CurrentUser, Body } from 'routing-controllers';

import { User } from './../models';
import { UserRepository } from './../repositories';
import { UserRequest } from './../requests/index';

@JsonController('/user')
export class UserController {

  constructor(private readonly userRepository: UserRepository) { }

  @Get('/')
  public async fetchAll() {
    return await this.userRepository.findAll();
  }

  @Get('/:id')
  public async fetchOne( @CurrentUser({ required: true }) user: User) {
    return user;
  }

  @Post('/')
  public async create( @Body({ required: true }) userRequest: UserRequest) {
    return this.userRepository.create(new User(userRequest));
  }
}
