import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FileService } from '../file/file.service';
import { PrismaService } from '../prisma/prisma.service';
import { ZakazService } from '../zakaz/zakaz.service';
import { ShopService } from '../shop/shop.service';

@Injectable()
export class SchedulerService {
  constructor(
    private prismaService: PrismaService,
    private zakazService: ZakazService,
    private fileService: FileService,
    private shopService: ShopService,
  ) {}

  private readonly logger = new Logger(SchedulerService.name);

  // Refetch shops from Zakaz API
  @Cron(CronExpression.EVERY_WEEKEND)
  async refetchShops() {
    // Fetch shops from Zakaz API and current external shops
    const [newExternalShops, { shops: currentExternalShops }] = await Promise.all([
      this.zakazService.getShops(),
      this.shopService.find({ source: 'external' }),
    ]);

    const shopsToImages: Record<string, number> = {};

    // Delete all external shops and save their images
    await Promise.all(
      currentExternalShops.map((shop) => {
        shopsToImages[shop.externalId] = shop.imageId;
        return this.shopService.delete(shop.id);
      }),
    );

    // Add external shops
    await Promise.all(
      newExternalShops.map(({ id, title }) => {
        const imageId = shopsToImages[id];
        return this.shopService.create({ title, imageId, isExternal: true, externalId: id });
      }),
    );

    this.logger.debug('Shops has been refetched');
  }

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
