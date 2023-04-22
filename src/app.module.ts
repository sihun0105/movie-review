import { Module,CacheModule, NestModule, MiddlewareConsumer, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthService } from './auth/auth.service';
import * as ormconfig from '../ormconfig';
import * as redisStore from 'cache-manager-ioredis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieService } from './movie/movie.service';
import { Movie } from './entities/movie.entity';
import { HttpModule } from '@nestjs/axios';
import { ReviewModule } from './review/review.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([User,Movie]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    CacheModule.register({
      //isGlobal: false,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    },
    ),
    HttpModule,
    ReviewModule,
    ScheduleModule.forRoot()
  ],
  controllers: [UserController,AppController],
  providers: [UserService, AuthService, JwtStrategy,AppService, MovieService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly movieService: MovieService) {}

  async onApplicationBootstrap() {
    const nowdate = new Date();
    let formattedDate = nowdate
      .getFullYear()
      .toString() +
      (nowdate.getMonth() + 1).toString().padStart(2, '0') +
      (nowdate.getDate() - 1).toString().padStart(2, '0');
    await this.movieService.fetchMovies(formattedDate);
  }
}
