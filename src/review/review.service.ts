import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/commnet.entity';
import { Movie } from 'src/entities/movie.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const commnet = this.commentRepository.create({
      comment: createReviewDto.comment,
      movieId: createReviewDto.movieId,
      userno: createReviewDto.writer,
    });
    return this.commentRepository.save(commnet);
  }

  async update(updateReviewDto: UpdateReviewDto) {
    const result = await this.commentRepository.findOne({
      where: { id: updateReviewDto.id },
    });
    if (!result) {
      throw new Error('데이터 없음.');
    }
    const updateData = Object.assign(result, updateReviewDto);
    return await this.commentRepository.save(updateData);
  }

  async remove(id: number) {
    const result = await this.commentRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('삭제할 데이터가 없습니다.');
    }
  }
}
