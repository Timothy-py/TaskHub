import {
  Model,
  Column,
  Table,
  DataType,
  PrimaryKey,
  Default,
  BelongsToMany,
} from 'sequelize-typescript';
import { TaskUser } from './../task/task-user.model';
import { Task } from './../task/task.model';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.UUID, allowNull: false })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastLogin: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  refreshToken: string;

  // Tasks-Users Many-To-Many relationship
  @BelongsToMany(() => Task, {
    through: () => TaskUser,
    as: 'assignedTasks',
  })
  assignedTasks: Task[];
}
