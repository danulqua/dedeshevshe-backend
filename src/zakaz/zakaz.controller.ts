import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { Controller, Get, InternalServerErrorException, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductZakazListDTO } from './dto/product-zakaz.dto';
import { SearchQueryDTO } from './dto/search-query.dto';
import { ShopZakazListDTO } from './dto/shop-zakaz.dto';
import { ProductZakaz } from './types';
import { ZakazService } from './zakaz.service';

@ApiTags('Zakaz API')
@ApiException(() => InternalServerErrorException)
@Controller('zakaz')
export class ZakazController {
  constructor(private zakazService: ZakazService) {}

  @ApiOperation({ summary: 'Get shops from Zakaz API' })
  @ApiOkResponse({ type: ShopZakazListDTO })
  @Get('shops')
  async getShops() {
    const shops = await this.zakazService.getShops();
    return { items: shops };
  }

  @ApiOperation({ summary: 'Search products from Zakaz API' })
  @ApiOkResponse({ type: ProductZakazListDTO })
  @Get('search')
  async searchProducts(@Query() queryDto: SearchQueryDTO) {
    const { q: query, ...filters } = queryDto;
    let products: ProductZakaz[] = [];

    if (filters.shopId) {
      products = await this.zakazService.getProductsByShop({ query, filters });
    } else {
      products = await this.zakazService.getProducts({ query, filters });
    }

    return { items: products };
  }
}
