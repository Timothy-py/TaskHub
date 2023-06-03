import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // specify default global api prefix
  app.setGlobalPrefix('/api/v1');

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
  await app.listen(PORT);
}
bootstrap();
