import { Injectable } from '@nestjs/common';
import { EmailService } from './../services/email.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Task } from './../src/task/task.model';

@Injectable()
export class TaskDueReminderService {
  constructor(private readonly emailService: EmailService) {}

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
