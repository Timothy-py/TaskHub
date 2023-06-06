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
import { TaskModule } from './task/task.module';
import { CacheModule } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
// import { TaskReminderJob } from './../jobs/taskReminder.job';

const REDIS_URL = process.env.REDIS_URL;
@Module({
  imports: [
    SequelizeModule.forRoot(dbConfig),
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TaskModule,
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      ttl: 1000,
      max: 100,
      store: `${redisStore}`,
      url: REDIS_URL,
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
  ],
  providers: [
    Logger,
    {
      provide: APP_GUARD,
      useClass: AtGuard, //automatically guard all routes with access token
    },
    // TaskReminderJob,
  ],
})
export class AppModule {}
