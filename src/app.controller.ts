import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MovieService } from './movie/movie.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly movieService: MovieService,
  ) {}
  @Get('/')
  getMoviedataSelf() {
    return this.movieService.getMovies();
  }
}
