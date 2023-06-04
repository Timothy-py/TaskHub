import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  // @IsDate()
  @IsDateString()
  @IsNotEmpty()
  readonly dueDate: Date;

  @IsDateString()
  @IsNotEmpty()
  readonly reminderDate: Date;
}
