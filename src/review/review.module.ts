import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Movie } from 'src/entities/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/commnet.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Comment])],
  controllers: [ReviewController],
  providers: [ReviewService, PrismaService],
})
export class ReviewModule {}
