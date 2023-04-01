import { Injectable, ExecutionContext, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Cache } from 'cache-manager';
import { from, map, Observable, switchMap } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject('CACHE_MANAGER')
    private cacheManager: Cache,
  ) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    const token = authHeader.substring(7);
    const payload = this.jwtService.verify(token);
    const refreshToken = this.userRepository.findOne({
      where: { id: payload.sub },
    });
    if (!refreshToken) {
      return false;
    }
    return true
  }
}
