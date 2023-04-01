import { CACHE_MANAGER,Inject,Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/Interface/JwtPayload.interface';
import { Cache } from 'cache-manager'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    console.log(payload)
    console.log(12312321312)
    const { sub, accessToken } = payload;
    await this.cacheManager.set(sub, accessToken,300);
    return payload;
  }
}
