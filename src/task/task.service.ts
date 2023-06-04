import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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

  // GET A TASK ITEM
  async getTask(userId: string, taskId: string): Promise<Task> {
    try {
      // *******implement check cache**********
      const task = await this.taskModel.findOne({
        where: {
          id: taskId,
          ownerId: userId,
        },
      });

      if (!task) throw new NotFoundException();

      this.logger.log(`Task retrieved successfully - ${task.id}`, this.SERVICE);

      return task;
    } catch (error) {
      if (error.response.message === 'Not Found')
        throw new NotFoundException('Task does not exist');

      this.logger.error(
        `Unable to retrieve task item - ${taskId}`,
        error.task,
        this.SERVICE,
      );
    }
  }
}
