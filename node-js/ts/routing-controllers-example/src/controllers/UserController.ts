import { JsonController, Get } from 'routing-controllers';

@JsonController('/user')
export class UserController {

  @Get('/')
  public async fetchAll() {
    return [];
  }
}
