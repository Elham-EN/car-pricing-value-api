import { Injectable, NotFoundException } from '@nestjs/common';
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
  public constructor(@InjectRepository(User) private repo: Repository<User>) {}

  //Create User and save to the database
  public create(email: string, password: string): Promise<User> {
    //Create instance of User entity
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  //Return single record/row based on the query
  public async findOne(id: number): Promise<User> {
    const user = await this.repo.findOneBy({ id });
    console.log('debug:', user);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  //Return a list of records/rows based on the query
  public find(email: string): Promise<User[]> {
    return this.repo.find({ where: { email } });
  }

  /**
   * Need type defination to be very flexible to update either the email
   * or password or both properties. User first off is a reference to our
   * user entity. Partial is type helper in typescript, tell attrs can be
   * any object that has at least or none some of the propertied of the User
   * class. The object has at least one property or all the properties of User
   * that would be consider a valid argument.
   */

  public async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    //Take all the properties from attrs and copy them directly to the user
    //overriding any properties that is already in the user object
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  public async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.repo.remove(user);
  }
}
