import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/user.model';
import { SignInDto, SignUpDto } from './dto';
import { Tokens } from './types/tokens.type';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // SIGNUP API
  @HttpCode(201)
  @ApiOperation({ summary: 'Signup a user' })
  @ApiBody({ type: SignUpDto })
  @Post('local/signup')
  signup(@Body() signupDto: SignUpDto): Promise<User> {
    return this.authService.signup(signupDto);
  }

  // SIGNIN API
  @HttpCode(200)
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiBody({ type: SignInDto })
  @Post('local/signin')
  signin(@Body() signinDto: SignInDto): Promise<Tokens> {
    return this.authService.signin(signinDto);
  }
}
