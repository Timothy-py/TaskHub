import * as dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import dbConfig from '../db/config';

@Module({
  imports: [SequelizeModule.forRoot(dbConfig)],
  controllers: [],
  providers: [],
})
export class AppModule {}
