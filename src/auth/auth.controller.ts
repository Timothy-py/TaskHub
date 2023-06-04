import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/user.model';
import { SignInDto, SignUpDto } from './dto';
import { Tokens } from './types/tokens.type';
import { GetUser, Public } from 'src/decorators';
import { RtGuard } from './guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // SIGNUP API
  @Public()
  @HttpCode(201)
  @ApiOperation({ summary: 'Signup a user' })
  @ApiBody({ type: SignUpDto })
  @Post('local/signup')
  signup(@Body() signupDto: SignUpDto): Promise<User> {
    return this.authService.signup(signupDto);
  }

  // SIGNIN API
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiBody({ type: SignInDto })
  @Post('local/signin')
  signin(@Body() signinDto: SignInDto): Promise<Tokens> {
    return this.authService.signin(signinDto);
  }

  // LOGOUT API
  @HttpCode(200)
  @ApiOperation({ summary: 'User logout' })
  @ApiBearerAuth()
  @Post('local/logout')
  logout(@GetUser('sub') userId: string) {
    return this.authService.logout(userId);
  }

  // REFRESH TOKEN API
  @Public()
  @UseGuards(RtGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBearerAuth()
  @Post('local/refresh')
  refreshToken(
    @GetUser('sub') userId: string,
    @GetUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
