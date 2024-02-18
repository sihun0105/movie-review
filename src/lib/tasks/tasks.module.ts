import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { MovieModule } from 'src/lib/movie/movie.module';

@Module({
  imports: [MovieModule],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
