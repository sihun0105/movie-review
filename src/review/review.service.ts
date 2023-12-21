import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Comment } from '@prisma/client';
import { Review } from './review.type';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async getReviewByMovieId(movieId: number): Promise<Review[]> {
    const reviewData = await this.prisma.comment.findMany({
      where: {
        movieId: +movieId,
        deletedAt: null,
      },
      select: {
        id: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            nickname: true,
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return reviewData;
  }

  async create({
    data,
    userId,
  }: {
    data: CreateReviewDto;
    userId: number;
  }): Promise<Comment> {
    return await this.prisma.comment.create({
      data: {
        userno: userId,
        comment: data.comment,
        movieId: +data.movieId,
      },
    });
  }

  async update({
    data,
    userId,
  }: {
    data: UpdateReviewDto;
    userId: number;
  }): Promise<Comment> {
    const existingComment = await this.prisma.comment.findUnique({
      where: { id: data.commentId },
    });

    if (!existingComment) {
      throw new Error('해당하는 comment가 없습니다.');
    }

    if (existingComment.userno !== userId) {
      throw new Error('본인의 comment만 업데이트할 수 있습니다.');
    }

    const updatedComment = await this.prisma.comment.update({
      where: { id: data.commentId },
      data: {
        comment: data.comment,
      },
    });

    return updatedComment;
  }

  async remove({
    commentId,
    userId,
  }: {
    commentId: number;
    userId: number;
  }): Promise<Comment> {
    const existingComment = await this.prisma.comment.findUnique({
      where: { id: +commentId },
    });

    if (!existingComment) {
      throw new Error('해당하는 comment가 없습니다.');
    }

    if (existingComment.userno !== userId) {
      throw new Error('본인의 comment만 삭제할 수 있습니다.');
    }

    const deletedComment = await this.prisma.comment.update({
      where: { id: +commentId },
      data: {
        deletedAt: new Date(),
      },
    });

    return deletedComment;
  }
}
