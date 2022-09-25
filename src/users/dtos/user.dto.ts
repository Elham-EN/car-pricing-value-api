import { Expose } from 'class-transformer';

//Here are the properties we want to send out inside of responses
export class UserDto {
  @Expose()
  public id: number;
  @Expose()
  public email: string;
}
