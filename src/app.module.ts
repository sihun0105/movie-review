import { Module,CacheModule, NestModule, MiddlewareConsumer } from '@nestjs/common';
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
import { AuthMiddleware } from './middleware/Auth.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([User]),
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
  ],
  controllers: [UserController,AppController],
  providers: [UserService, AuthService, JwtStrategy,AppService],
})
export class AppModule{}
// export class AppModule implements NestModule{
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//     .apply(AuthMiddleware).
//     forRoutes('*');
//   }
// }
