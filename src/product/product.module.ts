import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ZakazModule } from 'src/zakaz/zakaz.module';
import { ShopModule } from 'src/shop/shop.module';

@Module({
  imports: [ZakazModule, ShopModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
