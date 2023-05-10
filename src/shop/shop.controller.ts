import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateShopDto } from 'src/shop/dto/create-shop.dto';
import { ShopListDto } from 'src/shop/dto/shop-list.dto';
import { UpdateShopDto } from 'src/shop/dto/update-shop.dto';
import { ShopService } from 'src/shop/shop.service';

@Controller('shop')
export class ShopController {
  constructor(private shopService: ShopService) {}

  @Get('all')
  async find() {
    const shops = await this.shopService.find();
    return new ShopListDto(shops);
  }

  @Get(':shopId')
  findOne(@Param('shopId', ParseIntPipe) shopId: number) {
    return this.shopService.findOne(shopId);
  }

  @Post()
  create(@Body() shopDto: CreateShopDto) {
    return this.shopService.create(shopDto);
  }

  @Patch(':shopId')
  update(
    @Param('shopId', ParseIntPipe) shopId: number,
    @Body() shopDto: UpdateShopDto,
  ) {
    return this.shopService.update(shopId, shopDto);
  }

  @Delete(':shopId')
  delete(@Param('shopId', ParseIntPipe) shopId: number) {
    return this.shopService.delete(shopId);
  }
}
