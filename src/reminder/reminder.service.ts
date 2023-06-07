import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailService } from './../../services/email.service';
import { Task } from './../task/task.model';
import { TaskService } from './../task/task.service';

@Injectable()
export class ReminderService {
  constructor(
    private readonly taskService: TaskService,
    private readonly emailService: EmailService,
    private readonly logger: Logger,
  ) {}

  // cronjob to run function that queries tasks that are due for reminder
  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'Due tasks processor',
    timeZone: 'Africa/Lagos',
  })
  async dueTasksProcessor() {
    this.logger.log(`Cron job executed....`)
    await this.taskService.processTaskDueForReminders();
  }

  // event listener for activating email notification
  @OnEvent('sendReminderEmail')
  handleSendReminderEmail({
    userEmail,
    task,
  }: {
    userEmail: string;
    task: Task;
  }) {
    this.logger.log('Email event listener executed...')
    this.emailService.sendReminderEmail(userEmail, task);
  }
}
