import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SignUpDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';
import * as argon from 'argon2';
import { error } from 'console';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private readonly logger: Logger,
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
        `${error.messsgae}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // hash value
  async hasher(data: string) {
    const hash = await argon.hash(data);
    return hash;
  }
}
