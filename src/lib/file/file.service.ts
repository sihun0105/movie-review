import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class FileService {
  private readonly s3: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    AWS.config.update({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
      },
    });
    this.s3 = new AWS.S3();
  }

  public async uploadFiles(file: Express.Multer.File) {
    const key = `${Date.now() + file.originalname}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      ACL: 'private',
      Key: key,
      Body: file.buffer,
    };

    return new Promise((resolve, reject) => {
      this.s3.putObject(params, (err, data) => {
        if (err) reject(err);
        resolve(key);
      });
    });
  }
}
