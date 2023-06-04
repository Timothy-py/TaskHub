import { IsBoolean, IsNotEmpty } from 'class-validator';

export class updateTaskComplete {
  @IsNotEmpty()
  @IsBoolean()
  readonly isCompleted: boolean;
}
