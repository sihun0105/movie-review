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
  /**업데이트는 하루 1회로 수정할것. */
  @Get('/')
  getHello() {
    const nowdate = new Date();
    let formattedDate = nowdate.getFullYear().toString() + (nowdate.getMonth() + 1).toString().padStart(2, '0') + nowdate.getDate().toString().padStart(2, '0');
    console.log(formattedDate)
    return this.movieService.fetchMovies(formattedDate);
  }
}
