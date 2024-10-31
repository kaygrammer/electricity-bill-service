// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
//import { UsersController } from './users.controller';
import { User } from './user.model';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  //controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}