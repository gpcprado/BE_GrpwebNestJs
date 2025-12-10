import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import 'reflect-metadata';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;
  await app.listen(+port);
  console.log(`🚀 Server listening on http://localhost:${port}`);
}

bootstrap();
