// import { Injectable } from "@nestjs/common";
// import { Cron, CronExpression } from "@nestjs/schedule";
// import { TaskService } from "src/task/task.service";

// @Injectable()
// export class TaskReminderJob {
//     constructor(private readonly taskService: TaskService) {
//         // run every ***
//         @Cron(CronExpression.EVERY_HOUR, {
//             name: 'Task Reminder',
//             timeZone: 'Africa/Lagos'
//         })
//         async handleTaskReminders() {
//             const tasks = await taskService.getTaskDueForReminder();

//             for(const task of tasks) {
//                 // send email notifications to users assigned to task
//                 for(const user of task.users) {
//                     // Send email using your preferred email service or library
//                     // Example: this.emailService.sendNotificationEmail(user.email, task.title);
//                 }
//             }
//         }
//     }
// }
