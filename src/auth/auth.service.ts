import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { user } from '@prisma/client';
import { compare } from 'bcryptjs';
import { Cache } from 'cache-manager';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

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

  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    const acc = this.jwtService.sign(payload);
    const ref = await this.updateRefreshToken(user);
    await this.cacheManager.set(payload.username, acc, 300);
    return {
      accessToken: acc,
      refreshToken: ref,
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken)
      throw new BadRequestException('refreshToken이 없습니다.');
    const user = await this.findOneByRefreshToken(refreshToken);
    if (user) {
      const payload = { username: user.email, sub: user.id };
      return {
        accessToken: this.jwtService.sign(payload),
        refreshToken: await this.updateRefreshToken(user),
      };
    }
    return null;
  }
  async findOne(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOneByRefreshToken(refreshToken: string) {
    return this.prisma.user.findFirst({ where: { refreshToken } });
  }

  async updateRefreshToken(user: user) {
    const refreshToken = uuidv4();
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: refreshToken },
    });
    return refreshToken;
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
