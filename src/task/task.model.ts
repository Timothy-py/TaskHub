import {
  Model,
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsToMany,
  PrimaryKey,
  Default,
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/user.model';
import { TaskUser } from './task-user.model';

@Table({ tableName: 'tasks' })
export class Task extends Model<Task> {
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.UUID, allowNull: false })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'due_date',
  })
  dueDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'reminder_date',
  })
  reminderDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_completed',
  })
  isCompleted: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'reminder_sent',
  })
  reminderSent: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'owner_id',
  })
  ownerId: string;

  // Owner-Task One-To-One relationship
  @BelongsTo(() => User, 'owner_id')
  owner: User;

  // Users-Tasks Many-To-Many relationship
  @BelongsToMany(() => User, {
    through: () => TaskUser,
    as: 'assignedUsers',
  })
  assignedUsers: User[];
}
