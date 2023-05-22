import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService, private s3Service: S3Service) {}

  async uploadFile(file: Express.Multer.File) {
    const uploadedFile = await this.s3Service.uploadFile(file);

    return await this.prisma.image.create({
      data: {
        key: uploadedFile.key,
        url: uploadedFile.url,
      },
    });
  }

  async deleteFile(key: string) {
    await this.s3Service.deleteFile(key);
    return await this.prisma.image.delete({
      where: { key },
    });
  }
}
