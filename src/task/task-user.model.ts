import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Task } from './task.model';
import { User } from 'src/user/user.model';

// Task-User Many-To-Many relationship Table
@Table({ tableName: 'task_user' })
export class TaskUser extends Model<TaskUser> {
  @ForeignKey(() => Task)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  taskId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;
}
