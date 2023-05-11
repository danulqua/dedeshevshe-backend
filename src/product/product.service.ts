import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDTO } from 'src/product/dto/create-product.dto';
import { UpdateProductDTO } from 'src/product/dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async find() {
    const products = await this.prismaService.product.findMany();
    return products;
  }

  async findOne(productId: number) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product)
      throw new NotFoundException('Product with this id does not exist');

    return product;
  }

  async create(productDto: CreateProductDTO) {
    const shopFromDB = await this.prismaService.shop.findUnique({
      where: { id: productDto.shopId },
    });

    if (!shopFromDB)
      throw new NotFoundException('Shop with this id does not exist');

    if (productDto.userId) {
      const userFromDB = await this.prismaService.user.findUnique({
        where: { id: productDto.userId },
      });

      if (!userFromDB)
        throw new NotFoundException('User with this id does not exist');
    }

    const {
      title,
      description,
      url,
      price,
      discount,
      volume,
      weight,
      status,
      shopId,
      userId,
    } = productDto;

    const discountValue = discount?.value;
    const oldPrice = discount?.oldPrice;

    const product = await this.prismaService.product.create({
      data: {
        title,
        description,
        url,
        price,
        discount: discountValue,
        oldPrice,
        volume,
        weight,
        isExternal: false,
        status,
        shopId,
        userId,
      },
    });

    return product;
  }

  async update(productId: number, productDto: UpdateProductDTO) {
    const productFromDB = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!productFromDB) {
      throw new NotFoundException('Product with this id does not exist');
    }

    if (productDto.shopId) {
      const shopFromDB = await this.prismaService.shop.findUnique({
        where: { id: productDto.shopId },
      });

      if (!shopFromDB)
        throw new NotFoundException('Shop with this id does not exist');
    }

    if (productDto.userId) {
      const userFromDB = await this.prismaService.user.findUnique({
        where: { id: productDto.userId },
      });

      if (!userFromDB)
        throw new NotFoundException('User with this id does not exist');
    }

    const {
      title,
      description,
      url,
      price,
      discount,
      volume,
      weight,
      status,
      shopId,
      userId,
    } = productDto;

    const discountValue = discount?.value;
    const oldPrice = discount?.oldPrice;

    const updatedProduct = await this.prismaService.product.update({
      where: { id: productId },
      data: {
        title,
        description,
        url,
        price,
        discount: discountValue,
        oldPrice,
        volume,
        weight,
        status,
        shopId,
        userId,
      },
    });

    return updatedProduct;
  }

  async delete(productId: number) {
    const productFromDB = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!productFromDB) {
      throw new NotFoundException('Product with this id does not exist');
    }

    const deletedProduct = await this.prismaService.product.delete({
      where: { id: productId },
    });

    return deletedProduct;
  }
}
