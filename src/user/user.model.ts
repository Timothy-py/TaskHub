import { Model, Column, Table } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column
  email: string;

  @Column
  password: string;

  @Column
  name: string;

  @Column
  lastLogin: Date;
}
