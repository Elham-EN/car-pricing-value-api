import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Query,
  Session,
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
import { User } from './user.entity';

@Controller('auth')
export class UsersController {
  public constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @UseInterceptors(new SerializerInterceptor(UserDto))
  @Get('/whoami')
  public whoAmI(@Session() session: any): Promise<User> {
    return this.userService.findOne(session.userId);
  }

  @UseInterceptors(new SerializerInterceptor(UserDto))
  @Post('/signup')
  public async createUser(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signupUser(body.email, body.password);
    //Setup Session object by storing in user id
    session.userId = user.id;
    return user;
  }

  @UseInterceptors(new SerializerInterceptor(UserDto))
  @Post('/signin')
  public async signin(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signinUser(body.email, body.password);
    session.userId = user.id;
    return user;
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
