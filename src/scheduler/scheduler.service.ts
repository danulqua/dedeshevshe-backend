import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FileService } from 'src/file/file.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SchedulerService {
  constructor(
    private prismaService: PrismaService,
    private fileService: FileService,
  ) {}

  private readonly logger = new Logger(SchedulerService.name);

  @Cron(CronExpression.EVERY_WEEK)
  async deleteUnusedFiles() {
    const files = await this.prismaService.image.findMany({
      where: { isActive: false },
      select: { key: true, url: true },
    });

    // Delete files from the file system and from the database
    const deletionPromises = files.map((item) =>
      this.fileService.deleteFile(item.key),
    );

    await Promise.all(deletionPromises);
    this.logger.debug('All unused files has been deleted');
  }

  @Cron(CronExpression.EVERY_WEEK)
  async deleteInactiveProducts() {
    await this.prismaService.product.deleteMany({
      where: { status: 'INACTIVE' },
    });

    this.logger.debug('All inactive products has been deleted');
  }

  @Cron(CronExpression.EVERY_WEEK)
  async deleteExpiredTokens() {
    await this.prismaService.passwordResetToken.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });

    this.logger.debug('All expired tokens has been deleted');
  }
}
