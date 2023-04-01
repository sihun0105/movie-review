import { Injectable, NestMiddleware,CACHE_MANAGER,Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager'
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Invalid token');
      }

      const token = authHeader.substring(7);
      console.log(token)
      const payload = await this.jwtService.verifyAsync(token);

      const refreshToken = await this.userRepository.findOne({
        where:{id :payload.sub}
      });
 
      if (!refreshToken) {
        throw new Error('Invalid token');
      }
      const cachedAccessToken = await this.cacheManager.get(payload.sub)

      if (!cachedAccessToken) {
        throw new Error('Invalid token');
      }

      req.headers.authorization = `Bearer ${cachedAccessToken}`;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).send('Unauthorized');
    }
  }
}
