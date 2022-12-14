import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
//randomBytes - to generate a salt(give us a randon string of numbers & letters)
//scrypt - is a hashing function (actual hashing of the input password)
import { randomBytes, scrypt as _scrypt } from 'crypto';
//By default scrypt will give a callback not the password because of
//it asynchronous behaviour. promisify is a function that will take in a function
//that makes use of callbacks and it's going to give us back a version of that
//exact same function (scrypt) but instead it make uses of promises.
import { promisify } from 'util';

//Return promise instead of callback
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  public constructor(private userService: UsersService) {}

  //Sign Up the user and store it's credential into the database
  public async signupUser(email: string, password: string): Promise<User> {
    //Check if email already exist
    const users = await this.userService.find(email);
    if (users.length > 0) {
      throw new BadRequestException('email already exist');
    }
    //Hash the user's password
    //1) Generate a salt
    //randomBytes return a buffer, similar to an array but the difference is that
    //a buffer holds some raw data binary (1, 0). We don't want to work with 1 or
    //0, instead we want to work with a string of random numbers and letters
    const salt = randomBytes(8).toString('hex');
    //2) Hash the salt and the password together
    //We can customize the length of hash in the third argument
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //3) Join the hashed result and the salt together
    //Convert random bytes to hexidecimal string (numbers and letters)
    const result = salt + '.' + hash.toString('hex');
    //create a new user and save it
    const user = await this.userService.create(email, result);
    //return the new user
    return user;
  }

  //Sign In User by verifyig User's email and password
  public async signinUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    //Split salt and hash by a period between them and this return an array of two
    //elements, first element is the salt and the second element is the hash
    const [salt, storedHash] = user.password.split('.');
    //Rehash the supplied password from the user and the stored salt and take its
    //output to make sure the output is identical to the hash we had stored in DB
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('password incorrect');
    }
    return user;
  }

  //Cookie - Hey this person is signed in and this person is not.
  /**
   * Cookie authentication uses HTTP cookies to authenticate client requests and
   * maintain session information.
   *
   * We use cookie to tie some information to the incoming requestm an outgoing
   * response to store the ID of the user that this user just signed up to the
   * application or signed in into our application
   *
   * More Information:
   * https://www.section.io/engineering-education/cookie-vs-token-authentication/
   * https://swagger.io/docs/specification/authentication/cookie-authentication/
   */
}
