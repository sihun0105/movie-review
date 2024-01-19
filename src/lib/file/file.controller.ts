import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import path from 'path';
import { FileService } from './file.service';
import { ConfigService } from '@nestjs/config';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
  ) {}

  @Post('')
  @UseInterceptors(
    FilesInterceptor('image', 10, {
      storage: multer.diskStorage({
        destination(req, file, cb) {
          cb(null, 'uploads/');
        },
        filename(req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
      }),
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    }),
  )
  async uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    const imgurl: string[] = [];
    await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        const key = await this.fileService.uploadFiles(file);
        imgurl.push(this.configService.get('AWS_CLOUDFRONT') + key);
      }),
    );

    return {
      statusCode: 201,
      message: `이미지 등록 성공`,
      data: imgurl,
    };
  }
}
