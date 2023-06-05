import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './../user/user.model';
import * as argon from 'argon2';
import { Tokens } from './types/tokens.type';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Op } from 'sequelize';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private readonly logger: Logger,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  SERVICE: string = AuthService.name;

  // SIGNUP A NEW USER
  async signup(dto: SignUpDto): Promise<User> {
    try {
      // hash the password
      const hash_pass = await this.hasher(dto.password);

      const user = await this.userModel.create({
        password: hash_pass,
        email: dto.email,
        name: dto.name,
      });

      this.logger.log(`User created successfully - ${user.id}`, this.SERVICE);

      return user;
    } catch (error) {
      this.logger.error('Unable to create user', error.stack, this.SERVICE);

      if (error.name === 'SequelizeUniqueConstraintError')
        throw new HttpException('Email already exist', HttpStatus.CONFLICT);

      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // SIGN IN A USER
  async signin(dto: SignInDto): Promise<Tokens> {
    try {
      // find the user
      const user = await this.userModel.findOne({
        where: {
          email: dto.email,
        },
      });

      if (!user) throw new NotFoundException();

      // verify the password
      const verify_pass = await argon.verify(user.password, dto.password);

      if (!verify_pass) throw new HttpException('IP', 401);

      // generate sign in tokens
      const tokens = await this.getTokens(user.id, dto.email);
      await this.updateRTHash(user.id, tokens.refresh_token);

      this.logger.log(`User logged in - ${user.id}`, this.SERVICE);
      return tokens;
    } catch (error) {
      if (error.response.message === 'Not Found')
        throw new NotFoundException('User does not exist');
      else if (error.response === 'IP')
        throw new HttpException('Incorrect Password', HttpStatus.UNAUTHORIZED);

      this.logger.error('Unable to LOGIN user', error.stack, this.SERVICE);
      throw new HttpException(
        `${error.messsage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // USER LOGOUT
  async logout(userId: string) {
    try {
      await this.userModel.update(
        {
          refreshToken: null,
        },
        {
          where: {
            id: userId,
            refreshToken: {
              [Op.not]: null,
            },
          },
        },
      );

      this.logger.log(`User logged out`, this.SERVICE);
      return;
    } catch (error) {
      this.logger.error('Unable to LOGOUT user', error.stack, this.SERVICE);
      throw new HttpException('An error occured', 500);
    }
  }

  // REFRESH TOKEN SERVICE
  async refreshToken(userId: string, rt: string) {
    // find user
    const user = await this.userModel.findByPk(userId);

    // user does not exist or not logged in
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    // check if provided refresh token is correct
    const rtMatches = await argon.verify(user.refreshToken, rt);

    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(userId, user.email);

    await this.updateRTHash(userId, tokens.refresh_token);

    return tokens;
  }

  // ************ HELPER FUNCTIONS ******************
  // hash value
  async hasher(data: string) {
    const hash = await argon.hash(data);
    return hash;
  }

  // generate access and refresh tokens
  async getTokens(userId: string, email: string): Promise<Tokens> {
    const AT_SECRET = this.config.get('ACCESS_TOKEN_SECRET');
    const RT_SECRET = this.config.get('REFRESH_TOKEN_SECRET');

    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: userId,
          email: email,
        },
        {
          secret: AT_SECRET,
          expiresIn: 60 * 15,
        },
      ),

      this.jwt.signAsync(
        {
          sub: userId,
          email: email,
        },
        {
          secret: RT_SECRET,
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  // hash and update user refresh token
  async updateRTHash(userId: string, rt: string) {
    const hash = await this.hasher(rt);
    await this.userModel.update(
      {
        refreshToken: hash,
        lastLogin: new Date(),
      },
      {
        where: {
          id: userId,
        },
      },
    );

    return;
  }
}
