import { Logger, Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './task.model';
import { TaskUser } from './task-user.model';

@Module({
  imports: [SequelizeModule.forFeature([Task, TaskUser])],
  controllers: [TaskController],
  providers: [TaskService, Logger],
})
export class TaskModule {}
