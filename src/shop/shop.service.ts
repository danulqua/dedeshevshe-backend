import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Prisma, Shop } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateShopDTO } from 'src/shop/dto/create-shop.dto';
import { FindShopFiltersDTO } from 'src/shop/dto/find-shop-filters.dto';
import { UpdateShopDTO } from 'src/shop/dto/update-shop.dto';
import { ZakazService } from 'src/zakaz/zakaz.service';

@Injectable()
export class ShopService implements OnApplicationBootstrap {
  constructor(
    private prismaService: PrismaService,
    private zakazService: ZakazService,
  ) {}

  private readonly logger = new Logger(ShopService.name);

  async find(filtersDTO: FindShopFiltersDTO = {}) {
    const { title, source, limit, page = 1, sortBy, order } = filtersDTO;

    const query: Prisma.ShopFindManyArgs = {
      where: {
        title: title ? { contains: title, mode: 'insensitive' } : undefined,
        isExternal:
          source === 'external'
            ? true
            : source === 'internal'
            ? false
            : undefined,
      },
      take: limit,
      skip: limit,
      orderBy: sortBy ? { [sortBy]: order ?? 'asc' } : undefined,
    };

    if (page && limit) {
      query.skip = (page - 1) * limit;
    }

    const [shops, totalCount] = await Promise.all([
      this.prismaService.shop.findMany(query),
      this.prismaService.shop.count({ where: query.where }),
    ]);

    const totalPages = totalCount ? Math.ceil(totalCount / limit) || 1 : 0;

    return { shops, totalCount, totalPages };
  }

  async findOne(shopId: number) {
    const shop = await this.prismaService.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) throw new NotFoundException('Shop with this id does not exist');

    return shop;
  }

  async create(shopDto: CreateShopDTO) {
    const { title } = shopDto;

    const shopFromDB = await this.prismaService.shop.findUnique({
      where: { title },
    });

    if (shopFromDB) {
      throw new ConflictException('Shop with this title already exists');
    }

    const shop = await this.prismaService.shop.create({
      data: {
        title,
        isExternal: false,
      },
    });

    return shop;
  }

  async update(shopId: number, shopDto: UpdateShopDTO) {
    const { title } = shopDto;

    const shopFromDB = await this.prismaService.shop.findUnique({
      where: { id: shopId },
    });

    if (!shopFromDB) {
      throw new NotFoundException('Shop with this id does not exist');
    }

    const updatedShop = await this.prismaService.shop.update({
      where: { id: shopId },
      data: {
        title,
      },
    });

    return updatedShop;
  }

  async delete(shopId: number) {
    const shopFromDB = await this.prismaService.shop.findUnique({
      where: { id: shopId },
    });

    if (!shopFromDB) {
      throw new NotFoundException('Shop with this id does not exist');
    }

    const deletedShop = await this.prismaService.shop.delete({
      where: { id: shopId },
    });

    return deletedShop;
  }

  private async fetchExternalShops() {
    const externalShopsFromDB = await this.prismaService.shop.findMany({
      where: { isExternal: true },
    });

    if (externalShopsFromDB.length > 0) return;

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

  // If there are no external shops in DB - fetch them
  async onApplicationBootstrap() {
    await this.fetchExternalShops();
  }
}
