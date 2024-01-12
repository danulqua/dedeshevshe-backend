import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { zakazApi } from './api';
import { capitalize } from '../utils';
import {
  ProductResponse,
  SearchProductsFilters,
  SearchProductsByShopFilters,
  SearchProductsResponse,
  Shop,
} from './api/types';
import { ProductZakaz } from './types';
import { PrismaService } from '../prisma/prisma.service';

interface SearchProductsParams {
  query: string;
  filters: SearchProductsFilters;
}

interface SearchProductsByShopParams {
  query: string;
  filters: SearchProductsByShopFilters;
}

@Injectable()
export class ZakazService {
  constructor(private prismaService: PrismaService) {}

  async getShops() {
    try {
      const shops: Shop[] = [];

      // Fetch shops
      const response = await zakazApi.get('/stores');
      const { data } = response;

      // Filter out unique shops
      data.forEach((shop) => {
        const { id, retail_chain } = shop;

        if (!shops.find((item) => item.title.toLowerCase() === retail_chain)) {
          shops.push({ id, title: capitalize(retail_chain) });
        }
      });

      return shops;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async getProducts({ query, filters }: SearchProductsParams) {
    try {
      let resultsArray: ProductZakaz[] = [];

      // Get shops
      const shops = await this.prismaService.shop.findMany({
        where: { isExternal: true },
      });

      // Create promise array where every promise is going to make request to the specific shop
      const promises = shops.map((shop) =>
        zakazApi.get<SearchProductsResponse>(
          `stores/${shop.externalId}/products/search?q=${encodeURIComponent(query)}`,
        ),
      );

      // Wait until all requests will be finished
      const resolvedPromises = await Promise.all(promises);

      // Merge and transform result sets
      resolvedPromises.forEach((response, idx) => {
        resultsArray = [
          ...resultsArray,
          ...response.data.results
            .filter((item) => item.in_stock === true)
            .map((product) => {
              const transformed = this.transformProduct(product, shops[idx].title);
              return transformed;
            }),
        ];
      });

      // Filter result set with user filters
      resultsArray = this.filterResults(resultsArray, filters);
      return resultsArray;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async getProductsByShop({ query, filters }: SearchProductsByShopParams) {
    try {
      // Get shops
      const shops = await this.prismaService.shop.findMany({
        where: { isExternal: true },
      });
      // Find shop by query
      const shopTitle = shops.find((item) => item.externalId === filters.shopId).title;

      // Make request to the specific shop
      const response = await zakazApi.get<SearchProductsResponse>(
        `stores/${filters.shopId}/products/search?q=${encodeURIComponent(query)}`,
      );

      const { data } = response;

      // Transform result set
      const resultsArray = data.results
        .filter((item) => item.in_stock === true)
        .map((item) => this.transformProduct(item, shopTitle));

      // Filter result set with user filters
      const filteredResults = this.filterResults(resultsArray, filters);
      return filteredResults;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  // Transform product item in order to get rid of unnecessary properties
  private transformProduct(product: ProductResponse, shopTitle: string): ProductZakaz {
    return {
      ean: product.ean,
      title: product.title,
      shop: shopTitle,
      url: product.web_url,
      imageUrl: product.img?.s350x350,
      description: product.description || null,
      price: product.price / 100,
      discount: !product.discount.value
        ? null
        : {
            value: product.discount.value,
            oldPrice: product.discount.old_price / 100,
          },
      volume: product.volume,
      weight: product.weight,
    };
  }

  // Filter array with user filters
  private filterResults(
    data: ProductZakaz[],
    { maxPrice, discountsOnly }: Pick<SearchProductsByShopFilters, 'maxPrice' | 'discountsOnly'>,
  ) {
    let filteredData = data;

    if (maxPrice) {
      filteredData = filteredData.filter((item) => item.price <= maxPrice);
    }

    if (discountsOnly) {
      filteredData = filteredData.filter((item) => item.discount);
    }

    return filteredData;
  }
}
