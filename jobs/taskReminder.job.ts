import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskService } from './../src/task/task.service';

@Injectable()
export class TaskReminderJob {
  constructor(private taskService: TaskService) {}

  @Cron(CronExpression.EVERY_10_MINUTES, {
    name: 'Due tasks processor',
    timeZone: 'Africa/Lagos',
  })
  async dueTasksProcessor() {
    await this.taskService.processTaskDueForReminders();
  }
}
