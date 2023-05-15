import * as path from 'path';
import * as fs from 'node:fs/promises';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { existsSync } from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  async createFile(
    file: Express.Multer.File,
    ...allowableExtensions: string[]
  ) {
    if (!file) throw new BadRequestException('File is not provided');

    const extension = file.originalname.split('.').at(-1);
    if (allowableExtensions.length && !allowableExtensions.includes(extension))
      throw new BadRequestException(
        `File extension '.${extension}' is not allowed`,
      );

    const fileName = randomBytes(16).toString('hex') + `.${extension}`;
    const filePath = path.resolve(__dirname, '..', 'static', 'uploads');

    try {
      if (!existsSync(filePath)) {
        await fs.mkdir(filePath, { recursive: true });
      }

      await fs.writeFile(path.join(filePath, fileName), file.buffer);
      return await this.prisma.image.create({ data: { url: fileName } });
    } catch (e) {
      throw new InternalServerErrorException('Error while creating a file');
    }
  }

  async deleteFile(fileName: string) {
    const filePath = path.resolve(__dirname, '..', 'static', 'uploads');

    try {
      await fs.rm(path.join(filePath, fileName));
    } catch (e) {
      throw new InternalServerErrorException('Error while deleting a file');
    }
  }
}
