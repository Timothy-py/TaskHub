import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';
import * as argon from 'argon2';
import { error } from 'console';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

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

      return user;
    } catch (error) {
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
