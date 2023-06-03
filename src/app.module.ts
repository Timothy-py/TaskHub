import * as dotenv from 'dotenv';
dotenv.config();
import { Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import dbConfig from '../db/config';

@Module({
  imports: [SequelizeModule.forRoot(dbConfig), AuthModule, UserModule],
  providers: [Logger],
})
export class AppModule {}
