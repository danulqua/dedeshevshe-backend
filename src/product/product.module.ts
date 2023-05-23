import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ZakazModule } from 'src/zakaz/zakaz.module';
import { ShopModule } from 'src/shop/shop.module';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [ZakazModule, ShopModule, FileModule],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
