import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  // SIGNUP A NEW USER
  async signup(dto: SignUpDto): Promise<any> {
    return this.userModel.create(dto);
  }
}
