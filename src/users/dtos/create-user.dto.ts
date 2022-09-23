// Validate the body of the request
import { IsEmail, IsString } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
