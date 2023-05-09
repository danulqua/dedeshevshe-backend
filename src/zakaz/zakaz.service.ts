import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { zakazApi } from 'src/zakaz/api';
import { capitalize } from 'src/utils';
import {
  ProductResponse,
  SearchProductsFilters,
  SearchProductsResponse,
  Shop,
} from 'src/zakaz/api/types';
import { Product } from 'src/zakaz/types';

interface SearchProductsParams {
  query: string;
  filters: SearchProductsFilters;
}

@Injectable()
export class ZakazService {
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
      throw new InternalServerErrorException();
    }
  }

  async getProducts({ query, filters }: SearchProductsParams) {
    try {
      let resultsArray = [];
      // Get shops
      const shops = await this.getShops();

      // Create promise array where every promise is going to make request to the specific shop
      const promises = shops.map((shop) =>
        zakazApi.get(
          `stores/${shop.id}/products/search?q=${encodeURIComponent(query)}`,
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
              const transformed = this.transformProduct(
                product,
                shops[idx].title,
              );
              return transformed;
            }),
        ];
      });

      // Filter result set with user filters
      resultsArray = this.filterResults(resultsArray, filters);
      return resultsArray;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async getProductsByShop({ query, filters }: SearchProductsParams) {
    try {
      // Get shops
      const shops = await this.getShops();

      // Find shop by query
      const shopTitle = shops.find((item) => item.id === filters.shopId).title;

      // Make request to the specific shop
      const response = await zakazApi.get<SearchProductsResponse>(
        `stores/${filters.shopId}/products/search?q=${encodeURIComponent(
          query,
        )}`,
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
      throw new InternalServerErrorException();
    }
  }

  // Transform product item in order to get rid of unnecessary properties
  private transformProduct(
    product: ProductResponse,
    shopTitle: string,
  ): Product {
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
    data: Product[],
    {
      maxPrice,
      discountsOnly,
    }: Pick<SearchProductsFilters, 'maxPrice' | 'discountsOnly'>,
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
