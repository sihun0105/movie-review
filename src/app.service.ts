import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getCache(): string {
    return 'Hello World!';
  }
}