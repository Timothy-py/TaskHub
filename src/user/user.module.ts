import { Logger, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { Task } from './../task/task.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Task])],
  controllers: [UserController],
  providers: [UserService, Logger],
})
export class UserModule {}
