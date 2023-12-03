import { IsNotEmpty } from 'class-validator';

export class UpdateReviewDto {
  @IsNotEmpty()
  commentId: number;

  @IsNotEmpty()
  comment: string;
}
