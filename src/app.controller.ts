import { Controller, Get } from '@nestjs/common';
import { MovieService } from './lib/movie/movie.service';
@Controller()
export class AppController {
  constructor(private readonly movieService: MovieService) {}
  @Get('/')
  getMoviedataSelf() {
    return this.movieService.getMovies();
  }
}
