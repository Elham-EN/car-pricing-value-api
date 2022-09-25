// Validate the body of the request
import { IsEmail, IsString } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  public email: string;
  @IsString()
  public password: string;
}
