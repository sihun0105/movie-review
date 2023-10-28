export interface Movie {
  movieNm: string;
  movieCd: string;
  audiAcc: number;
}

export interface MovieResponse {
  boxOfficeResult: {
    dailyBoxOfficeList: Movie[];
  };
}
