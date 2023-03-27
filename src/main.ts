import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import morgan from 'morgan';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'))
  await app.listen(3000);
}
bootstrap();
