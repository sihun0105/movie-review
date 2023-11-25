import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcryptjs';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { user } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async validateUser(email: string, password: string) {
    if (!email || !password)
      throw new BadRequestException('email , password에 문제가 있습니다.');
    const user = await this.findOne(email);
    if (!user) {
      return null;
    }

    const isMatch = await compare(password, user.password);
    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Omit<user, 'password'>) {
    const payload = { username: user.email, userid: user.id };
    const acc = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    });
    const refreshPayload = { payload, acc };
    const ref = this.jwtService.sign(refreshPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
    });
    return {
      accessToken: acc,
      refreshToken: ref,
      expireTime: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    };
  }

  async refresh(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    const { refresh_token } = refreshTokenDto;
    if (!refresh_token) {
      throw new UnauthorizedException('Refresh token must be provided');
    }
    const decodedRefreshToken = this.jwtService.verify(refresh_token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
    const payload = {
      username: decodedRefreshToken.payload.username,
      userid: decodedRefreshToken.payload.userid,
    };
    const userId = decodedRefreshToken.payload.username;
    if (!userId) {
      throw new UnauthorizedException('Invalid user!');
    }
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    });
    return { accessToken };
  }

  async findOne(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(email: string, password: string, nickname: string) {
    const hashedPassword = await hash(password, 10);
    const user = this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
      },
    });
    return user;
  }
}
