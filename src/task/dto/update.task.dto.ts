import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsDateString()
  readonly dueDate: Date;

  @IsOptional()
  @IsDateString()
  readonly reminderDate: Date;

  @IsOptional()
  @IsBoolean()
  readonly isCompleted: boolean;
}
