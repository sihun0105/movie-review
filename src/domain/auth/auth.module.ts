import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/domain/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from '@/lib/prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
