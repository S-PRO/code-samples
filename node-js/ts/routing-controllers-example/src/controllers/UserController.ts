import { JsonController, Get, Post, Param, CurrentUser, Body } from 'routing-controllers';

import { User } from './../models';
import { UserService } from './../services';
import { UserRequest } from './../requests/index';

@JsonController('/user')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @Get('/')
  public async fetchAll() {
    return await this.userService.findAll();
  }

  @Get('/:id')
  public async fetchOne( @CurrentUser({ required: true }) user: User) {
    return user;
  }

  @Post('/')
  public async create( @Body({ required: true }) userRequest: UserRequest) {
    return this.userService.create(new User(userRequest));
  }
}
