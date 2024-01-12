import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PriceHistory, Prisma, Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { FindProductFiltersDTO } from './dto/find-product-filters.dto';
import { PriceHistoryItem } from './dto/price-history.dto';
import { ReportOption } from './dto/report-option.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { ShopService } from '../shop/shop.service';
import { ZakazService } from '../zakaz/zakaz.service';

const productInclude = {
  shop: {
    select: {
      id: true,
      title: true,
      image: {
        select: {
          id: true,
          url: true,
        },
      },
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
} satisfies Prisma.ProductInclude;

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
        status: status ?? { not: 'IN_REVIEW' },
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
    if (!filtersDTO.title) throw new BadRequestException('Product title is required');

    const { title, shopId, maxPrice, discountsOnly, limit, page = 1 } = filtersDTO;

    const shops = await this.prismaService.shop.findMany({
      include: {
        image: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    // If shopId was provided - we possibly can search either only internally or both internally and externally
    // If shopId was not provided - we have to search both internally and externally
    if (shopId) {
      const shopFromDB = await this.shopService.findOne(shopId);

      if (!shopFromDB) throw new NotFoundException('Shop with this id does not exist');

      // If shop is external - we have to search both internally and externally
      if (shopFromDB.isExternal) {
        const internalPromise = this.find({
          ...filtersDTO,
          limit: undefined,
          page: undefined,
          status: 'ACTIVE',
        });
        const externalPromise = this.zakazService.getProductsByShop({
          query: title,
          filters: { shopId: shopFromDB.externalId, maxPrice, discountsOnly },
        });

        const [internalProducts, externalProducts] = await Promise.all([
          internalPromise,
          externalPromise,
        ]);

        // Sort products by price in ascending order
        const products = [
          ...internalProducts.products,
          ...externalProducts.map((p) => {
            const shop = shops.find((s) => p.shop === s.title);
            return {
              ...p,
              isExternal: true,
              shop: {
                id: shop.id,
                title: shop.title,
                image: shop?.image,
              },
            };
          }),
        ].sort((a, b) => a.price - b.price);

        // Paginate products
        const totalCount = products.length;
        const totalPages = totalCount ? Math.ceil(totalCount / limit) || 1 : 0;

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = limit ? products.slice(startIndex, endIndex) : products;

        return { products: paginatedProducts, totalCount, totalPages };
      }

      // Shop is internal - we have to search only internally
      const result = await this.find({ ...filtersDTO, status: 'ACTIVE' });
      return result;
    }

    try {
      // shopId is not provided - we have to search both internally and externally
      const internalPromise = this.find({
        ...filtersDTO,
        page: undefined,
        limit: undefined,
        status: 'ACTIVE',
      });
      const externalPromise = this.zakazService.getProducts({
        query: title,
        filters: {
          maxPrice: filtersDTO.maxPrice,
          discountsOnly: filtersDTO.discountsOnly,
        },
      });

      const [internalProducts, externalProducts] = await Promise.all([
        internalPromise,
        externalPromise,
      ]);

      // Sort products by price in ascending order
      const products = [
        ...internalProducts.products,
        ...externalProducts.map((p) => {
          const shop = shops.find((s) => p.shop === s.title);
          return {
            ...p,
            isExternal: true,
            shop: {
              id: shop.id,
              title: shop.title,
              image: shop?.image,
            },
          };
        }),
      ].sort((a, b) => a.price - b.price);

      // Paginate products
      const totalCount = products.length;
      const totalPages = totalCount ? Math.ceil(totalCount / limit) || 1 : 0;

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = limit ? products.slice(startIndex, endIndex) : products;

      return { products: paginatedProducts, totalCount, totalPages };
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async findOne(productId: number) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
      include: productInclude,
    });

    if (!product) throw new NotFoundException(`Product with id ${productId} does not exist`);

    return product;
  }

  async create(userId: number, productDTO: CreateProductDTO) {
    if (productDTO.imageId) {
      const fileToUpdate = await this.prismaService.image.findUnique({
        where: { id: productDTO.imageId },
      });

      if (!fileToUpdate) throw new BadRequestException('Provided file does not exist');
    }

    const shopFromDB = await this.prismaService.shop.findUnique({
      where: { id: productDTO.shopId },
    });

    if (!shopFromDB)
      throw new BadRequestException(`Shop with id ${productDTO.shopId} does not exist`);

    if (userId) {
      const userFromDB = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      if (!userFromDB) throw new BadRequestException(`User with id ${userId} does not exist`);
    }

    const { title, description, url, price, discount, volume, weight, status, shopId, imageId } =
      productDTO;

    const discountValue = discount?.value;
    const oldPrice = discount?.oldPrice;

    const [product] = await Promise.all([
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
    ]);

    await this.prismaService.priceHistory.create({
      data: {
        productId: product.id,
        price: product.price,
      },
    });

    return product;
  }

  async update(productId: number, productDTO: UpdateProductDTO) {
    const productFromDB = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!productFromDB) {
      throw new NotFoundException(`Product with id ${productId} does not exist`);
    }

    if (productDTO.shopId) {
      const shopFromDB = await this.prismaService.shop.findUnique({
        where: { id: productDTO.shopId },
      });

      if (!shopFromDB)
        throw new NotFoundException(`Shop with id ${productDTO.shopId} does not exist`);
    }

    const { title, description, url, price, discount, volume, weight, status, shopId, imageId } =
      productDTO;

    if (imageId !== undefined) {
      await this.updateImage(productFromDB, imageId);
    }

    const isDiscount = discount !== undefined;
    const discountValue = isDiscount !== null ? discount?.value : null;
    const oldPrice = isDiscount !== null ? discount?.oldPrice : null;

    const updatedProduct = await this.prismaService.product.update({
      where: { id: productId },
      data: {
        title,
        description,
        url,
        price,
        discount: discountValue,
        oldPrice: oldPrice,
        volume,
        weight,
        status,
        shopId,
        imageId,
      },
      include: productInclude,
    });

    if (updatedProduct.price !== productFromDB.price) {
      await this.prismaService.priceHistory.create({
        data: {
          productId: updatedProduct.id,
          price: updatedProduct.price,
        },
      });
    }

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

    if (!fileToUpdate) throw new BadRequestException('Provided file does not exist');

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
      throw new NotFoundException(`Product with id ${productId} does not exist`);
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

  async getPriceHistoryReport(productId: number, option: ReportOption) {
    const productFromDB = await this.prismaService.product.findUnique({
      where: { id: productId },
      include: productInclude,
    });

    if (!productFromDB) {
      throw new NotFoundException(`Product with id ${productId} does not exist`);
    }

    const priceHistory = await this.prismaService.priceHistory.findMany({
      where: { productId },
      orderBy: { createdAt: 'asc' },
    });

    const lastDate = new Date();
    if (option === ReportOption.WEEK) {
      lastDate.setDate(lastDate.getDate() - 7);
    } else if (option === ReportOption.MONTH) {
      lastDate.setMonth(lastDate.getMonth() - 1);
    } else if (option === ReportOption.YEAR) {
      lastDate.setFullYear(lastDate.getFullYear() - 1);
    }

    const filteredPriceHistory = priceHistory.filter(
      (item) => new Date(item.createdAt) >= lastDate,
    );

    const uniquePriceHistory = this.getUniquePriceHistory(filteredPriceHistory);
    return {
      product: {
        id: productFromDB.id,
        title: productFromDB.title,
      },
      shop: {
        id: productFromDB.shop.id,
        title: productFromDB.shop.title,
      },
      priceHistory: uniquePriceHistory,
    };
  }

  private getUniquePriceHistory(priceHistory: PriceHistory[]) {
    const uniqueDays: Map<string, PriceHistoryItem> = new Map();

    for (const item of priceHistory) {
      const day = item.createdAt.toISOString().slice(0, 10);

      if (uniqueDays.has(day)) {
        uniqueDays.get(day).price = item.price;
      } else {
        uniqueDays.set(day, { createdAt: item.createdAt, price: item.price });
      }
    }

    return Array.from(uniqueDays.values());
  }
}
