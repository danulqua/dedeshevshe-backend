import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  DeleteObjectCommandInput,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow<string>('AWS_S3_REGION'),
  });

  constructor(private configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File) {
    const key = file.fieldname + '-' + Date.now().toString();
    const bucket = this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');

    const uploadParams: PutObjectCommandInput = {
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    const putCommand = new PutObjectCommand(uploadParams);

    try {
      const response = await this.s3Client.send(putCommand);

      if (response.$metadata.httpStatusCode === 200) {
        return {
          key,
          url: `https://${bucket}.s3.amazonaws.com/${key}`,
        };
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteFile(key: string) {
    const bucket = this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');

    const deleteParams: DeleteObjectCommandInput = {
      Bucket: bucket,
      Key: key,
    };

    const deleteCommand = new DeleteObjectCommand(deleteParams);

    try {
      const response = await this.s3Client.send(deleteCommand);
      if (response.$metadata.httpStatusCode === 204) {
        return { message: 'File deleted successfully' };
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
