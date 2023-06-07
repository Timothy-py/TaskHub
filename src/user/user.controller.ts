import {
  Controller,
  Get,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from './../decorators/getUser.decorator';
import { User } from './user.model';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(200)
  @ApiOperation({summary: 'Get user profile'})
  @ApiBearerAuth()
  @Get('')
  myProfile(@GetUser('sub') userId: string):Promise<User> {
    return this.userService.myProfile(userId);
  }
}
