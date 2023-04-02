import { CACHE_MANAGER, Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Cache } from 'cache-manager'
import { MovieService } from './movie/movie.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly movieService : MovieService,
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
  @Get('/')
  getHello() {
    return this.movieService.fetchMovies('20230301');
  }
}
