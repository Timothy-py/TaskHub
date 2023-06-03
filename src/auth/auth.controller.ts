import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/user.model';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // SIGNUP API
  @HttpCode(201)
  @ApiOperation({ summary: 'Signup a user' })
  @ApiBody({ type: SignUpDto })
  @Post('signup')
  signup(@Body() signupDto: SignUpDto): Promise<User> {
    return this.authService.signup(signupDto);
  }
}
