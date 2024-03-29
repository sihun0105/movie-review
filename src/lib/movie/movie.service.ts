import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { MovieResponse } from './movie-type';
import axios from 'axios';

@Injectable()
export class MovieService {
  private readonly apiKey = process.env.MOVIE_SECRET;
  private readonly baseUrl =
    'http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json';

  constructor(private prisma: PrismaService) {}

  async getMovies() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const movieList = await this.prisma.movie.findMany({
      where: {
        updatedAt: {
          gte: today,
        },
      },
      take: 10,
      orderBy: {
        rank: 'asc',
      },
    });

    return movieList;
  }

  async fetchMovies(date: string): Promise<void> {
    const url = `${this.baseUrl}?key=${this.apiKey}&targetDt=${date}`;
    const response = await axios.get<MovieResponse>(url);
    if (response.data.boxOfficeResult.dailyBoxOfficeList) {
      const movieList = response.data.boxOfficeResult.dailyBoxOfficeList;
      const upsertMovies = movieList.map((movieData) =>
        this.prisma.movie.upsert({
          where: { movieCd: +movieData.movieCd },
          update: {
            title: movieData.movieNm,
            audience: +movieData.audiAcc,
            rank: +movieData.rank,
            updatedAt: new Date(),
          },
          create: {
            title: movieData.movieNm,
            movieCd: +movieData.movieCd,
            audience: +movieData.audiAcc,
            rank: +movieData.rank,
          },
        }),
      );

      await Promise.all(upsertMovies);
    }
  }
}
