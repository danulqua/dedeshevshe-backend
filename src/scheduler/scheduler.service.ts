import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Shop } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ZakazService } from 'src/zakaz/zakaz.service';

@Injectable()
export class SchedulerService implements OnApplicationBootstrap {
  constructor(
    private prismaService: PrismaService,
    private zakazService: ZakazService,
  ) {}

  private readonly logger = new Logger(SchedulerService.name);

  // FIXME: increase interval to 1 week
  @Cron(CronExpression.EVERY_30_MINUTES)
  async fetchExternalShops() {
    const deletedExternalShopsFromDB = await this.prismaService.shop.deleteMany(
      {
        where: { isExternal: true },
      },
    );

    if (deletedExternalShopsFromDB.count > 0) {
      this.logger.debug('Deleted external shops from DB');
    } else {
      this.logger.debug('No external shops were deleted from DB');
    }

    const externalShops = await this.zakazService.getShops();
    const preparedShops = externalShops.map(
      (shop): Omit<Shop, 'id' | 'createdAt' | 'updatedAt'> => ({
        title: shop.title,
        externalId: shop.id,
        isExternal: true,
      }),
    );

    await this.prismaService.shop.createMany({
      data: preparedShops,
    });

    this.logger.debug('External shops were fetched and saved to DB');
  }

  async onApplicationBootstrap() {
    await this.fetchExternalShops();
  }
}
