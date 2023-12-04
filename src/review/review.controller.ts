import {
  Controller,
  Post,
  Body,
  Delete,
  UseGuards,
  Request,
  Get,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @Get('')
  @UseGuards(JwtAuthGuard)
  getReviewByMovieId(@Query('movieId') movieId: number) {
    return this.reviewService.getReviewByMovieId(movieId);
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    const userId = req.user.userid;
    return this.reviewService.create({ data: createReviewDto, userId: userId });
  }

  @Post('/update')
  @UseGuards(JwtAuthGuard)
  update(@Request() req, @Body() updateReviewDto: UpdateReviewDto) {
    const userId = req.user.userid;
    return this.reviewService.update({ data: updateReviewDto, userId: userId });
  }

  @Delete('')
  @UseGuards(JwtAuthGuard)
  remove(@Request() req, @Body() { commentId }: { commentId: number }) {
    const userId = req.user.userid;
    return this.reviewService.remove({ commentId, userId });
  }
}
