import { CACHE_MANAGER, Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Cache } from 'cache-manager'
import { JwtAuthGuard } from './auth/JwtAuthGuard';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}
  
  @Get("/cache")
  async getCache() {
    console.log(123)
    const savedTime = await this.cacheManager.get<number>('time')
    if( savedTime ){
      return "saved time : " + savedTime
    }
  }
}
