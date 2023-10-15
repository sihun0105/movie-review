import {
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Cache } from 'cache-manager';
import { MovieService } from './movie/movie.service';
import { Cron } from '@nestjs/schedule';
import { JwtAuthGuard } from './auth/JwtAuthGuard';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly movieService: MovieService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  @Get('/')
  @UseGuards(JwtAuthGuard)
  getMoviedataSelf() {
    return this.movieService.getMovies();
  }

  @Cron('0 0 * * *')
  getMoviedata() {
    console.log('Executing task once a day');
    const nowdate = new Date();
    const formattedDate =
      nowdate.getFullYear().toString() +
      (nowdate.getMonth() + 1).toString().padStart(2, '0') +
      (nowdate.getDate() - 1).toString().padStart(2, '0');
    this.movieService.fetchMovies(formattedDate);
  }
}
