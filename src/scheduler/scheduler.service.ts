import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FileService } from 'src/file/file.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SchedulerService {
  constructor(private prismaService: PrismaService, private fileService: FileService) {}

  private readonly logger = new Logger(SchedulerService.name);

  // Delete files from the S3 bucket and database
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async deleteUnusedFiles() {
    const files = await this.prismaService.image.findMany({
      where: { isActive: false },
      select: { key: true, url: true },
    });

    const deletionPromises = files.map((item) => this.fileService.deleteFile(item.key));

    await Promise.all(deletionPromises);
    this.logger.debug('All unused files has been deleted');
  }

  // Delete all products with status INACTIVE
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async deleteInactiveProducts() {
    await this.prismaService.product.deleteMany({
      where: { status: 'INACTIVE' },
    });

    this.logger.debug('All inactive products has been deleted');
  }

  // Delete all expired tokens for password reset
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async deleteExpiredTokens() {
    await this.prismaService.passwordResetToken.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });

    this.logger.debug('All expired tokens has been deleted');
  }
}
