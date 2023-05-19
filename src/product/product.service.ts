import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDTO } from 'src/product/dto/create-product.dto';
import { FindProductFiltersDTO } from 'src/product/dto/find-product-filters.dto';
import { UpdateProductDTO } from 'src/product/dto/update-product.dto';
import { ShopService } from 'src/shop/shop.service';
import { ZakazService } from 'src/zakaz/zakaz.service';

const productInclude: Prisma.ProductInclude = {
  shop: {
    select: {
      id: true,
      title: true,
    },
  },
  user: {
    select: {
      id: true,
      name: true,
    },
  },
  image: {
    select: {
      id: true,
      url: true,
    },
  },
};

@Injectable()
export class ProductService {
  constructor(
    private prismaService: PrismaService,
    private shopService: ShopService,
    private zakazService: ZakazService,
  ) {}

  // Find products internally
  async find(filtersDTO: FindProductFiltersDTO = {}) {
    const {
      title,
      shopId,
      maxPrice,
      discountsOnly,
      status,
      userId,
      limit,
      page = 1,
      sortBy,
      order,
    } = filtersDTO;

    const query: Prisma.ProductFindManyArgs = {
      where: {
        title: title ? { contains: title, mode: 'insensitive' } : undefined,
        shopId: shopId ?? undefined,
        price: maxPrice ? { lte: maxPrice } : undefined,
        discount: discountsOnly ? { gt: 0 } : undefined,
        status: status ?? undefined,
        userId: userId ?? undefined,
      },
      include: productInclude,
      take: limit,
      skip: limit ? limit * (page - 1) : undefined,
      orderBy: sortBy ? { [sortBy]: order ?? 'asc' } : undefined,
    };

    const [products, totalCount] = await Promise.all([
      this.prismaService.product.findMany(query),
      this.prismaService.product.count({ where: query.where }),
    ]);

    const totalPages = totalCount ? Math.ceil(totalCount / limit) || 1 : 0;

    return { products, totalCount, totalPages };
  }

  // Find products both internally and externally
  async findGlobally(filtersDTO: FindProductFiltersDTO = {}) {
    if (!filtersDTO.title)
      throw new BadRequestException('Product title is required');

    const {
      title,
      shopId,
      maxPrice,
      discountsOnly,
      limit,
      page = 1,
    } = filtersDTO;

    // If shopId is provided - we have to find out then to search internally or externally
    if (shopId) {
      const shopFromDB = await this.shopService.findOne(shopId);

      if (!shopFromDB)
        throw new NotFoundException('Shop with this id does not exist');

      // If shop is external - we have to search externally
      if (shopFromDB.isExternal) {
        const products = (
          await this.zakazService.getProductsByShop({
            query: title,
            filters: { shopId: shopFromDB.externalId, maxPrice, discountsOnly },
          })
        ).map((p) => ({ ...p, isExternal: true }));

        // Sort products by price in ascending order
        products.sort((a, b) => a.price - b.price);

        // Paginate products
        const totalCount = products.length;
        const totalPages = totalCount ? Math.ceil(totalCount / limit) || 1 : 0;

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = limit
          ? products.slice(startIndex, endIndex)
          : products;

        return { products: paginatedProducts, totalCount, totalPages };
      } else {
        // If shop is internal - we have to search internally
        const result = await this.find({ ...filtersDTO, status: 'ACTIVE' });
        return result;
      }
    } else {
      // If shopId is not provided - we have to search both internally and externally
      const internalPromise = this.find({ ...filtersDTO, status: 'ACTIVE' });
      const externalPromise = this.zakazService.getProducts({
        query: title,
        filters: { maxPrice, discountsOnly },
      });

      const [internalProducts, externalProducts] = await Promise.all([
        internalPromise,
        externalPromise,
      ]);

      // Sort products by price in ascending order
      const products = [
        ...internalProducts.products,
        ...externalProducts.map((p) => ({ ...p, isExternal: true })),
      ].sort((a, b) => a.price - b.price);

      // Paginate products
      const totalCount = products.length;
      const totalPages = totalCount ? Math.ceil(totalCount / limit) || 1 : 0;

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = limit
        ? products.slice(startIndex, endIndex)
        : products;

      return { products: paginatedProducts, totalCount, totalPages };
    }
  }

  async findOne(productId: number) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
      include: productInclude,
    });

    if (!product)
      throw new NotFoundException(
        `Product with id ${productId} does not exist`,
      );

    return product;
  }

  async create(userId: number, productDTO: CreateProductDTO) {
    if (productDTO.imageId) {
      const fileToUpdate = await this.prismaService.image.findUnique({
        where: { id: productDTO.imageId },
      });

      if (!fileToUpdate)
        throw new BadRequestException('Provided file does not exist');
    }

    const shopFromDB = await this.prismaService.shop.findUnique({
      where: { id: productDTO.shopId },
    });

    if (!shopFromDB)
      throw new BadRequestException(
        `Shop with id ${productDTO.shopId} does not exist`,
      );

    if (userId) {
      const userFromDB = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      if (!userFromDB)
        throw new BadRequestException(`User with id ${userId} does not exist`);
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
      imageId,
    } = productDTO;

    const discountValue = discount?.value;
    const oldPrice = discount?.oldPrice;

    const [product] = await [
      this.prismaService.product.create({
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
          imageId,
        },
        include: productInclude,
      }),
      this.prismaService.image.update({
        where: { id: imageId },
        data: { isActive: true },
      }),
    ];

    return product;
  }

  async update(productId: number, productDTO: UpdateProductDTO) {
    const productFromDB = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!productFromDB) {
      throw new NotFoundException(
        `Product with id ${productId} does not exist`,
      );
    }

    if (productDTO.shopId) {
      const shopFromDB = await this.prismaService.shop.findUnique({
        where: { id: productDTO.shopId },
      });

      if (!shopFromDB)
        throw new NotFoundException(
          `Shop with id ${productDTO.shopId} does not exist`,
        );
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
      imageId,
    } = productDTO;

    if (imageId !== undefined) {
      await this.updateImage(productFromDB, imageId);
    }

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
        imageId,
      },
      include: productInclude,
    });

    return updatedProduct;
  }

  private async updateImage(productFromDB: Product, newImageId: number | null) {
    if (!newImageId) {
      await this.prismaService.image.update({
        where: { id: productFromDB.imageId },
        data: { isActive: false },
      });

      return;
    }

    const fileToUpdate = await this.prismaService.image.findUnique({
      where: { id: newImageId },
    });

    if (!fileToUpdate)
      throw new BadRequestException('Provided file does not exist');

    if (productFromDB.imageId) {
      await this.prismaService.image.update({
        where: { id: productFromDB.imageId },
        data: { isActive: false },
      });
    }

    await this.prismaService.image.update({
      where: { id: newImageId },
      data: { isActive: true },
    });
  }

  async delete(productId: number) {
    const productFromDB = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!productFromDB) {
      throw new NotFoundException(
        `Product with id ${productId} does not exist`,
      );
    }

    if (productFromDB.imageId) {
      await this.prismaService.image.update({
        where: { id: productFromDB.imageId },
        data: { isActive: false },
      });
    }

    const deletedProduct = await this.prismaService.product.delete({
      where: { id: productId },
    });

    return deletedProduct;
  }
}
