import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateShopDto } from 'src/shop/dto/create-shop.dto';
import { UpdateShopDto } from 'src/shop/dto/update-shop.dto';

@Injectable()
export class ShopService {
  constructor(private prismaService: PrismaService) {}

  async find() {
    const shops = await this.prismaService.shop.findMany();
    return shops;
  }

  async findOne(shopId: number) {
    const shop = await this.prismaService.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) throw new NotFoundException('Shop with this id does not exist');

    return shop;
  }

  async create(shopDto: CreateShopDto) {
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

  async update(shopId: number, shopDto: UpdateShopDto) {
    const { title } = shopDto;

    const shopFromDB = await this.prismaService.shop.findUnique({
      where: { id: shopId },
    });

    if (!shopFromDB) {
      throw new NotFoundException('Shop with this id does not exist');
    }

    const shop = await this.prismaService.shop.update({
      where: { id: shopId },
      data: {
        title,
      },
    });

    return shop;
  }

  async delete(shopId: number) {
    const shopFromDB = await this.prismaService.shop.findUnique({
      where: { id: shopId },
    });

    if (!shopFromDB) {
      throw new NotFoundException('Shop with this id does not exist');
    }

    const shop = await this.prismaService.shop.delete({
      where: { id: shopId },
    });

    return shop;
  }
}
