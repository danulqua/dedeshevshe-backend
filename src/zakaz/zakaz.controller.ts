import { Controller, Get, Query } from '@nestjs/common';
import { SearchQueryDTO } from 'src/zakaz/dto/search-query.dto';
import { Product } from 'src/zakaz/types';
import { ZakazService } from 'src/zakaz/zakaz.service';

@Controller('zakaz')
export class ZakazController {
  constructor(private zakazService: ZakazService) {}

  @Get('shops')
  async getShops() {
    const shops = await this.zakazService.getShops();
    return { items: shops };
  }

  @Get('search')
  async searchProducts(@Query() queryDto: SearchQueryDTO) {
    const { q: query, ...filters } = queryDto;
    let products: Product[] = [];

    if (filters.shopId) {
      products = await this.zakazService.getProductsByShop({ query, filters });
    } else {
      products = await this.zakazService.getProducts({ query, filters });
    }

    return { items: products };
  }
}
