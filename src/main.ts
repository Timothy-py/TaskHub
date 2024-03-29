import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { instance } from 'logger/winston.logger';
import { ReminderService } from './reminder/reminder.service';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // inject winston logger
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
  });

  // specify default global api prefix
  app.setGlobalPrefix('/api/v1');

  // strip dto with no validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // start the task reminder scheduler
  // const taskReminderJob = app.get(ReminderService);
  // taskReminderJob.dueTasksProcessor();

  // setup swagger documentation
  const config = new DocumentBuilder()
    .setTitle('TaskHub API')
    .setDescription('Swagger OpenAPI documentation for TaskHub API')
    .setVersion('1.0')
    .setContact(
      'Timothy',
      'https://github.com/Timothy-py',
      'adeyeyetimothy33@gmail.com',
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);
  await app.listen(PORT);
  console.log(`Server running on PORT - ${PORT}`);
}
bootstrap();
