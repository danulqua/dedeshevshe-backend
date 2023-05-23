import { Module } from '@nestjs/common';
import { SupermarketController } from './supermarket.controller';
import { ProductModule } from 'src/product/product.module';
import { FileModule } from 'src/file/file.module';
import { ShopModule } from 'src/shop/shop.module';

@Module({
  imports: [ProductModule, ShopModule, FileModule],
  controllers: [SupermarketController],
})
export class SupermarketModule {}
