import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../user/user.model';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from './strategies';
import { UserService } from './../user/user.service';
import { Task } from '../task/task.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Task]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, UserService, Logger, AtStrategy, RtStrategy],
})
export class AuthModule {}
