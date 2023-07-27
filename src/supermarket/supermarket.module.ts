import { Module } from '@nestjs/common';
import { SupermarketController } from './supermarket.controller';
import { ProductModule } from '../product/product.module';
import { FileModule } from '../file/file.module';
import { ShopModule } from '../shop/shop.module';

@Module({
  imports: [ProductModule, ShopModule, FileModule],
  controllers: [SupermarketController],
})
export class SupermarketModule {}
