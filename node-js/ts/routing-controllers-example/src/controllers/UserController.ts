import { JsonController, Get, Param } from 'routing-controllers';
import { Inject, Container } from 'typedi';
import { notFound } from 'boom';

import { User } from './../models';
import { UserRepository } from './../repositories';

@JsonController('/user')
export class UserController {

  constructor(private readonly userService: UserRepository) { }

  @Get('/')
  public async fetchAll() {
    return await this.userService.findAll();
  }

  @Get('/:id')
  public async fetchOne( @Param('id') id: number) {
    const user = await this.userService.findOne(id);
    if (!user) throw notFound();
    return user;
  }
}
