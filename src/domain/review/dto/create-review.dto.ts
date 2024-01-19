import { IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  movieId: number;

  @IsNotEmpty()
  comment: string;
}
