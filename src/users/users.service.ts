import { Injectable } from '@nestjs/common';
//Hook up the User Repository to the User Service
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  /**
   * First the argument name is repo, the type annotation Repository and applied
   * generic type of User. This means that repo is going to be an instance of a
   * typeORM Repository that deals with instances of user. The InjectRepository
   * is going to tell the dependency injection system that we need user repository.
   * Use this anytime when you need a typeORM repository.
   */
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  //Create User and save to the database
  create(email: string, password: string) {
    //Create instance of User entity
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }
}
