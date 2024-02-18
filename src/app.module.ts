import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './domain/auth/jwt.strategy';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ReviewModule } from './domain/review/review.module';
import { FileModule } from './lib/file/file.module';
import { MovieService } from './lib/movie/movie.service';
import { UserModule } from './domain/user/user.module';
import { AuthModule } from './domain/auth/auth.module';
import { PrismaModule } from './lib/prisma/prisma.module';
import { MovieModule } from './lib/movie/movie.module';
import { TasksModule } from './lib/tasks/tasks.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { ChannelsModule } from './domain/channels/channels.module';
import { EventsModule } from './gateway/events/events.module';
@Module({
  imports: [
    PassportModule,
    JwtModule,
    ReviewModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    FileModule,
    UserModule,
    AuthModule,
    PrismaModule,
    MovieModule,
    TasksModule,
    ChannelsModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    JwtStrategy,
    AppService,
    MovieService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
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
