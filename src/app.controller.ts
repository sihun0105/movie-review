import { CACHE_MANAGER, Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Cache } from 'cache-manager'
import { JwtAuthGuard } from './auth/JwtAuthGuard';
import { AuthGuard } from '@nestjs/passport';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}
  
  @Get("/cache")
  async getCache() {
    console.log(222)
    const savedTime = await this.cacheManager.get<number>('time')
    if( savedTime ){
      return "saved time : " + savedTime
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  getHello(): string {
    console.log(222222)
    return this.appService.gethello();
  }
}
