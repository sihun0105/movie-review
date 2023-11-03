import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { comment } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto): Promise<comment> {
    return await this.prisma.comment.create({
      data: {
        comment: createReviewDto.comment,
        movieId: createReviewDto.movieId,
        userno: createReviewDto.writer,
      },
    });
  }

  async update(updateReviewDto: UpdateReviewDto): Promise<comment> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: updateReviewDto.id,
      },
    });
    if (!comment) {
      throw new Error('데이터 없음.');
    }
    return await this.prisma.comment.update({
      where: { id: updateReviewDto.id },
      data: {
        comment: updateReviewDto.comment,
        userno: updateReviewDto.writer,
      },
    });
  }

  async remove(id: number): Promise<comment> {
    const comment = await this.prisma.comment.delete({
      where: {
        id: id,
      },
    });
    if (!comment) {
      throw new Error('삭제할 데이터가 없습니다.');
    }
    return comment;
  }
}
