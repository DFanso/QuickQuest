import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useRequestLogging } from './request-logging';
import { VersioningType } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    rawBody: true,
    bodyParser: true,
  });
  useRequestLogging(app);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(
    '/api',
    basicAuth({
      challenge: true,
      users: {
        admin: '123@Hub',
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Service-hub API')
    .setDescription('Service-hub Backend API')
    .setVersion('1.0')
    .addTag('Service-hub')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();

  await app.listen(9000);
}
bootstrap();
