import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { PrismaService } from '@/lib/prisma/prisma.service';

@Module({
  providers: [MovieService, PrismaService],
  exports: [MovieService],
})
export class MovieModule {}
