import { Logger, Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { TaskService } from './../task/task.service';
import { EmailService } from './../../services/email.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './../task/task.model';
import { User } from './../user/user.model';
import { Sequelize } from 'sequelize';
import dbConfig from './../../db/config';

@Module({
  imports: [SequelizeModule.forFeature([Task, User])],
  providers: [
    ReminderService,
    TaskService,
    EmailService,
    Logger,
    {
      provide: Sequelize,
      useValue: new Sequelize(dbConfig),
    },
  ],
})
export class ReminderModule {}
