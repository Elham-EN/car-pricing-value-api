import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  public constructor(private userService: UsersService) {}

  @Post('/signup')
  public createUser(@Body() body: CreateUserDto) {
    this.userService.create(body.email, body.password);
  }
}
