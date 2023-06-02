import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);
  await app.listen(3000);
}
bootstrap();
