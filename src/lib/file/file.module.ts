import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import fs from 'fs';
import { HttpModule } from '@nestjs/axios';

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}
@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('MULTER_DEST'),
      }),
      inject: [ConfigService],
    }),
    HttpModule,
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
