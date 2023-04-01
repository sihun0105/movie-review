import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UserService } from '../user/user.service';
import { Cache } from 'cache-manager'
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);
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
    const ref = await this.userService.updateRefreshToken(user)
    await this.cacheManager.set(payload.username, acc,300);
    return {
      accessToken: acc,
      refreshToken: ref
    };
  }

  async refresh(refreshToken: string) {
    const user = await this.userService.findOneByRefreshToken(refreshToken);
    if (user) {
      const payload = { username: user.email, sub: user.id };
      return {
        accessToken: this.jwtService.sign(payload),
        refreshToken: await this.userService.updateRefreshToken(user),
      };
    }
    return null;
  }
}
