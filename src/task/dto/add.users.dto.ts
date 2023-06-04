import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class AddUsersToTaskDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEmail({}, { each: true })
  emails: string[];
}
