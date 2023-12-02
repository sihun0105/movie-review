import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthService } from './auth/auth.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieService } from './movie/movie.service';
import { HttpModule } from '@nestjs/axios';
import { ReviewModule } from './review/review.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from './prisma/prisma.service';
import { AuthController } from './auth/auth.controller';
import { TasksService } from './tasks/tasks.service';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
@Module({
  imports: [
    PassportModule,
    JwtModule,
    HttpModule,
    ReviewModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    FileModule,
  ],
  controllers: [UserController, AppController, AuthController],
  providers: [
    UserService,
    AuthService,
    JwtStrategy,
    AppService,
    MovieService,
    PrismaService,
    TasksService,
  ],
})
export class AppModule implements OnApplicationBootstrap, NestModule {
  constructor(private readonly movieService: MovieService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
  async onApplicationBootstrap() {
    const nowdate = new Date();
    const formattedDate =
      nowdate.getFullYear().toString() +
      (nowdate.getMonth() + 1).toString().padStart(2, '0') +
      (nowdate.getDate() - 1).toString().padStart(2, '0');
    await this.movieService.fetchMovies(formattedDate);
  }
}
