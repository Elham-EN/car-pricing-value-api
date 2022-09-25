import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';
/**
 * Exclude is decorator that is going to create a little set of rules
 * that describe how to take an instance of a user and turn it into a
 * plain object.
 */
//import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public email: string;

  @Column()
  public password: string;

  //Whenever we insert a new user into our database, this function
  //should be called. These are called hooks
  @AfterInsert()
  public logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  public logUpdate() {
    console.log('Updated User with id', this.id);
  }

  @AfterRemove()
  public logRemove() {
    console.log('Removed User with id', this.id);
  }
}
