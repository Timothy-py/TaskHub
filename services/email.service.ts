import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Task } from './../src/task/task.model';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Initialize the email transporter
    this.transporter = nodemailer.createTransport({
      host: configService.get('EMAIL_HOST'),
      port: configService.get('EMAIL_PORT'),
      secure: false,
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendReminderEmail(toEmail: string, task: Task) {
    try {
      const message = {
        from: `TaskHub <${this.configService.get('EMAIL_USER')}>`,
        to: toEmail,
        subject: 'Task Reminder',
        html: `<p>Hello,</p><p>This is a reminder for the task:</p><ul><li>Title: ${task.title}</li><li>Description: ${task.description}</li><li>Due Date: ${task.dueDate}</li></ul><p>Thank you.</p>`,
      };

      await this.transporter.sendMail(message);
    } catch (error) {
      console.error('Error sending reminder email:', error);
    }
  }
}
