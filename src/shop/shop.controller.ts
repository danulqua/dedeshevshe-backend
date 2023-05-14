import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateShopDTO } from 'src/shop/dto/create-shop.dto';
import { FindShopFiltersDTO } from 'src/shop/dto/find-shop-filters.dto';
import { ShopListDTO } from 'src/shop/dto/shop-list.dto';
import { UpdateShopDTO } from 'src/shop/dto/update-shop.dto';
import { ShopService } from 'src/shop/shop.service';

@Controller('shop')
export class ShopController {
  constructor(private shopService: ShopService) {}

  @Get('all')
  async find(@Query() filtersDTO: FindShopFiltersDTO) {
    const { shops, totalCount, totalPages } = await this.shopService.find(
      filtersDTO,
    );

    return new ShopListDTO({ items: shops, totalCount, totalPages });
  }

  @Get(':shopId')
  findOne(@Param('shopId', ParseIntPipe) shopId: number) {
    return this.shopService.findOne(shopId);
  }

  @Post()
  create(@Body() shopDto: CreateShopDTO) {
    return this.shopService.create(shopDto);
  }

  @Patch(':shopId')
  update(
    @Param('shopId', ParseIntPipe) shopId: number,
    @Body() shopDto: UpdateShopDTO,
  ) {
    return this.shopService.update(shopId, shopDto);
  }

  @Delete(':shopId')
  delete(@Param('shopId', ParseIntPipe) shopId: number) {
    return this.shopService.delete(shopId);
  }
}
