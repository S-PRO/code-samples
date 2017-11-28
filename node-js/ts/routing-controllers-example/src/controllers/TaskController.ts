import { JsonController, Get, Param } from 'routing-controllers';
import { notFound } from 'boom';

import { User } from './../models';
import { UserRepository } from './../repositories';

@JsonController('/user/:id/task')
export class UserController {

  constructor(
    private readonly userService: UserRepository
  ) { }

  
}
