import { JsonController, Get } from 'routing-controllers';
import { Inject, Container } from 'typedi';

import { User } from './../models';
import { UserRepository } from './../repositories';

@JsonController('/user')
export class UserController {

  constructor(private readonly userService: UserRepository) { }

  @Get('/')
  public async fetchAll() {
    return await this.userService.findAll();
  }
}
