import { Module,CacheModule } from '@nestjs/common';
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
@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    CacheModule.register({
      //isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      // clusterConfig: {
      // },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, JwtStrategy],
})
export class AppModule {}
