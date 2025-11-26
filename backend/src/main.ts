import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const allowedOrigins = configService.get<string>('FRONTEND_ORIGIN');
  app.enableCors({
    origin: allowedOrigins
      ? allowedOrigins.split(',').map((origin) => origin.trim())
      : true,
    credentials: true,
  });

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}
bootstrap();
