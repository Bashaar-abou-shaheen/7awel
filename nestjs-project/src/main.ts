import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: false, 
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,         
      whitelist: true,         
      forbidNonWhitelisted: false,
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
