import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Query,
  //These tools we are going to use to intercept the outgoing response.
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
//Custom Interceptor class
import { SerializerInterceptor } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
export class UsersController {
  public constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  public createUser(@Body() body: CreateUserDto) {
    return this.authService.signupUser(body.email, body.password);
  }

  //Nest is expecting id as a string and TypeORM is expecting id as a number
  @UseInterceptors(new SerializerInterceptor(UserDto))
  @Get('/:id')
  public findUser(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  //Pull information from the query string email
  @UseInterceptors(new SerializerInterceptor(UserDto))
  @Get()
  public findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('/:id')
  public removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  public updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}

/**
 * DTO not only handle incoming requests but also handling the format of outgoing
 * response data.
 *
 *
 * So we are going to create UserDTO that describe exactly how we want to
 * format a user entity. In order words, what properties we want to include
 * for a very specific route handler.
 */
