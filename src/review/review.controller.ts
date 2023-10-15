import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Post('/update')
  update(@Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(updateReviewDto);
  }

  @Delete()
  remove(@Body() id: string) {
    return this.reviewService.remove(+id);
  }
}
