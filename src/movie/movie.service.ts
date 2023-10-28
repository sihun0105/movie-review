import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { MovieResponse } from './movie-type';

@Injectable()
export class MovieService {
  private readonly apiKey = process.env.MOVIE_SECRET;
  private readonly baseUrl =
    'http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json';

  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
  ) {}

  async getMovies() {
    const movieList = await this.prisma.movie.findMany({});
    return movieList;
  }

  async fetchMovies(date: string): Promise<void> {
    const url = `${this.baseUrl}?key=${this.apiKey}&targetDt=${date}`;
    const response = await this.httpService.get<MovieResponse>(url).toPromise();

    const movieList = response.data.boxOfficeResult.dailyBoxOfficeList;

    await this.prisma.movie.deleteMany({});

    const createMovies = movieList.map((movieData) =>
      this.prisma.movie.create({
        data: {
          title: movieData.movieNm,
          movieCd: +movieData.movieCd,
          audience: +movieData.audiAcc,
        },
      }),
    );

    await Promise.all(createMovies);
  }
}
