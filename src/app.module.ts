import * as dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import dbConfig from '../db/config';

@Module({
  imports: [SequelizeModule.forRoot(dbConfig), AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
