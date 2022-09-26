import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';

@Module({
  // Create the repository (Connect entity to it's parent module)
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  //To connect classes in the module
  providers: [UsersService, AuthService],
})
export class UsersModule {}
