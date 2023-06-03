import * as dotenv from 'dotenv';
dotenv.config();
import { Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import dbConfig from '../db/config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/guard';

@Module({
  imports: [
    SequelizeModule.forRoot(dbConfig),
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  providers: [
    Logger,
    {
      provide: APP_GUARD,
      useClass: AtGuard, //automatically guard all routes with access token
    },
  ],
})
export class AppModule {}
