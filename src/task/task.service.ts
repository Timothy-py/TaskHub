import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from 'src/task/task.model';
import {
  AddUsersToTaskDto,
  CreateTaskDto,
  UpdateTaskDto,
  updateTaskComplete,
} from './dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Sequelize } from 'sequelize';
import { User } from 'src/user/user.model';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task) private taskModel: typeof Task, // model
    @InjectModel(User) private userModel: typeof User,
    private readonly logger: Logger, // log
    @Inject(CACHE_MANAGER) private cache: Cache,
    @Inject(Sequelize) private readonly sequelize: Sequelize,
  ) {}

  SERVICE: string = TaskService.name;

  // **********************CREATE A TASK ITEM**********************
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

  // **********************GET A TASK ITEM**********************
  async getTask(userId: string, taskId: string): Promise<Task> {
    try {
      // first check if task is available in the cache
      const cacheKey = `task_${taskId}`;
      let task: Task = await this.cache.get(cacheKey);

      // if it is not available
      if (!task) {
        task = await this.taskModel.findOne({
          where: {
            id: taskId,
            ownerId: userId,
          },
        });

        if (!task) throw new NotFoundException();

        // save task into cache memory
        await this.cache.set(cacheKey, task);
      }

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

  //   **********************EDIT/UPDATE A TASK ITEM**********************
  async editTask(
    taskId: string,
    userId: string,
    dto: UpdateTaskDto,
  ): Promise<Task> {
    const transaction = await this.sequelize.transaction();
    try {
      // update task in db
      const [numOfAffectedRows, updateTask] = await this.taskModel.update(dto, {
        where: {
          id: taskId,
          ownerId: userId,
        },
        returning: true,
        transaction: transaction,
      });

      if (numOfAffectedRows === 0)
        throw new NotFoundException('Task Not Found');

      //   remove task from cache
      const cacheKey = `task_${taskId}`;
      await this.cache.del(cacheKey);

      const updatedTask = await this.taskModel.findByPk(taskId, {
        transaction,
      });
      await transaction.commit();

      this.logger.log(`Task updated successfully - ${taskId}`, this.SERVICE);

      return updatedTask;
    } catch (error) {
      if (error.status === 404) throw new NotFoundException('Task Not Found');
      this.logger.error(
        `Unable to update task - ${taskId}`,
        error.stack,
        this.SERVICE,
      );

      await transaction.rollback();
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //   **********************UPDATE TASK COMPLETE STATUS**********************
  async updateTaskComplete(
    taskId: string,
    userId: string,
    dto: updateTaskComplete,
  ) {
    try {
      const [numOfAffectedRows, updatedTask] = await this.taskModel.update(
        dto,
        {
          where: {
            id: taskId,
            ownerId: userId,
          },
          returning: true,
        },
      );

      this.logger.log(`Task updated successfully - ${taskId}`, this.SERVICE);

      return updatedTask;
    } catch (error) {
      this.logger.error(
        `Unable to update task complete status - ${taskId}`,
        error.stack,
        this.SERVICE,
      );

      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //   **********************DELETE TASK**********************
  async deleteTask(taskId: string, userId: string) {
    try {
      await this.taskModel.destroy({
        where: {
          id: taskId,
          ownerId: userId,
        },
      });

      // remove task from cache
      const cacheKey = `task_${taskId}`;
      try {
        await this.cache.del(cacheKey);
      } catch (error) {
        // TODO: Implement a Fallback mechanism: remove task from cache
        // If cache delete fails, the data is still removed from the database
        this.logger.warn(
          `Cache delete failed for ${cacheKey}: ${error.message}`,
          this.SERVICE,
        );
      }

      return;
    } catch (error) {
      this.logger.error(`Unable to delete task - ${taskId}`, this.SERVICE);
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //   **********************ADD USERS TO A TASK**********************
  async addUsersToTask(
    taskId: string,
    userId: string,
    dto: AddUsersToTaskDto,
  ): Promise<Task> {
    try {
      // find the task in the database: base on 1-1 relation with User
      const task = await this.taskModel.findByPk(taskId, {
        include: [{ model: User, as: 'owner' }],
      });

      // check if user is the owner
      if (task.ownerId != userId) throw new ForbiddenException();

      // handle when task is not found
      if (!task) throw new NotFoundException();

      // find users with the specified emails
      const users = await this.userModel.findAll({
        where: { email: dto.emails },
      });
      console.log('Users = ', users);

      // associate the users with the task
      await task.$set('assignedUsers', users);

      // find the task in the db: base on *-* relation with user
      const updatedTask = await this.taskModel.findByPk(taskId, {
        include: [{ model: User, as: 'assignedUsers' }],
      });

      this.logger.log(
        `Users added to Task successfully - ${taskId}`,
        this.SERVICE,
      );

      return updatedTask;
    } catch (error) {
      if (error.status === 403) throw new ForbiddenException('Access Denied!');
      this.logger.error(
        `Unable to add users to task - ${taskId}`,
        error.stack,
        this.SERVICE,
      );

      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //   **********************VIEW ALL TASK USERS**********************
  async viewTaskUsers(taskId: string): Promise<Task> {
    try {
      const task = await this.taskModel.findByPk(taskId, {
        include: [
          { model: User, as: 'owner' },
          { model: User, as: 'assignedUsers' },
        ],
      });

      if (!task) throw new NotFoundException();

      this.logger.log(
        `Task users retrieved successfully - ${taskId}`,
        this.SERVICE,
      );

      return task;
    } catch (error) {
      if (error.status === 404) throw new NotFoundException('Task Not Found');
      this.logger.error(
        `Unable to retrieve task users - ${taskId}`,
        error.stack,
        this.SERVICE,
      );

      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //   **********************HELPER FUNCTIONS**********************
  async getTaskDueForReminder(): Promise<Task[]> {
    const currentDate = new Date();

    const tasks = this.taskModel.findAll({
      where: {
        isCompleted: false,
        reminderDate: {
          $lte: currentDate,
        },
      },
      include: ['users'],
    });

    return tasks;
  }
}
