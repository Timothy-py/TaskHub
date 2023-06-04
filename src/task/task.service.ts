import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from 'src/task/task.model';
import { CreateTaskDto } from './dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task) private taskModel: typeof Task,
    private readonly logger: Logger,
  ) {}

  SERVICE: string = TaskService.name;

  // CREATE A TASK ITEM
  async createTask(userId: string, dto: CreateTaskDto): Promise<Task> {
    try {
      // create a new task instance
      const task = new this.taskModel();
      task.title = dto.title;
      task.description = dto.description;
      task.dueDate = dto.dueDate;
      task.reminderDate = dto.reminderDate;
      task.ownerId = userId;

      // save the task in db
      await task.save();

      this.logger.log(`Task created successfully - ${task.id}`, this.SERVICE);

      return task;
    } catch (error) {
      this.logger.error('Unable to create task', error.stack, this.SERVICE);

      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
