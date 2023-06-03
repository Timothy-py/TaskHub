import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  readonly description?: string;

  @IsDate()
  @IsNotEmpty()
  readonly dueDate: Date;

  @IsDate()
  @IsNotEmpty()
  readonly reminderDate: Date;

  @IsString()
  @IsNotEmpty()
  readonly ownerId: string;
}
