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
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
//Custom Interceptor class
import { SerializerInterceptor } from 'src/interceptors/serialize.interceptor';

@Controller('auth')
export class UsersController {
  public constructor(private userService: UsersService) {}

  @Post('/signup')
  public createUser(@Body() body: CreateUserDto) {
    this.userService.create(body.email, body.password);
  }

  //Nest is expecting id as a string and TypeORM is expecting id as a number
  @UseInterceptors(SerializerInterceptor)
  @Get('/:id')
  public findUser(@Param('id') id: string) {
    console.log('handler is running');

    return this.userService.findOne(parseInt(id));
  }

  //Pull information from the query string email
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
 * Interceptor can be use to intercept incoming requests and/or outgoing responses
 * We can think of Interceptor as being similar to middleware
 *
 * class CustomInterceptor
 * method: intercept(context: ExecutionContext, next: CallHandler)
 * This method is going to be called automatically any time our interceptor needs
 * to run. So handle incoming request or outgoing response.
 *
 * context agrument is a wrapper around some information on the incoming request
 *
 * next argument is rxjs Observable (Observable: represents the idea of an invokable
 * collection of future values or events), it's kind of route handler
 *
 * which you can use to invoke the route handler method at some point in your
 * interceptor.
 *
 * Serialize
 * Serialization is a process that happens before objects are returned in a network
 * response. This is an appropriate place to provide rules for transforming and sanitizing
 * the data to be returned to the client. For example, sensitive data like passwords
 * should always be excluded from the response.
 *
 * So we are going to create UserDTO that describe exactly how we want to
 * format a user entity. In order words, what properties we want to include
 * for a very specific route handler.
 */
