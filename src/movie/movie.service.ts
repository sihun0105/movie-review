// kofic.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Movie } from 'src/entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MovieService {
  private readonly apiKey = process.env.MOVIE_SECRET;
  private readonly baseUrl = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json';

  constructor(
    private httpService: HttpService,
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
  ) {}

  async fetchMovies(date: string): Promise<void> {
    const url = `${this.baseUrl}?key=${this.apiKey}&targetDt=${date}`;
    const response: AxiosResponse = await this.httpService.get(url).toPromise();

    const movieList = response.data.boxOfficeResult.dailyBoxOfficeList;

    for (const movieData of movieList) {
      const movie = new Movie();
      const checkMovie = await this.movieRepository.findOne({where:{title:movieData.movieNm}})
      if(!checkMovie){
        movie.title = movieData.movieNm;
        movie.audience = movieData.audiAcc;
        await this.movieRepository.save(movie);
      }else{
        checkMovie.audience=movieData.audiAcc
        await this.movieRepository.delete({})
        await this.movieRepository.save(checkMovie);
      }
    }
  }
}

