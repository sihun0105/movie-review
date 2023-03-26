import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly nestJwtService: NestJwtService) {}

  signPayload(payload: any) {
    return this.nestJwtService.sign(payload);
  }
}
