import { CACHE_MANAGER,Inject,Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { JwtPayload } from 'src/Interface/JwtPayload.interface';
import { RedisService } from 'nestjs-redis';
import { Cache } from 'cache-manager'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_secret_key',
    });
  }
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const { sub, accessToken } = payload;
    console.log('@@@@@@@@')
    console.log(sub)
    await this.cacheManager.set(sub, accessToken,300);
return payload;
  }
}
