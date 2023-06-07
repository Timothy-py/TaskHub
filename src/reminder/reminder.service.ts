import { Injectable } from '@nestjs/common';
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
  ) {}

  // cronjob to run function that queries tasks that are due for reminder
  @Cron(CronExpression.EVERY_10_MINUTES, {
    name: 'Due tasks processor',
    timeZone: 'Africa/Lagos',
  })
  async dueTasksProcessor() {
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
    this.emailService.sendReminderEmail(userEmail, task);
  }
}
