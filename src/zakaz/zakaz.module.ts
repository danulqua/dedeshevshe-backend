import { Module } from '@nestjs/common';
import { ZakazService } from './zakaz.service';
import { ZakazController } from './zakaz.controller';
import { ShopService } from 'src/shop/shop.service';
import { ShopModule } from 'src/shop/shop.module';

// Zakaz Module
@Module({
  imports: [ShopModule],
  providers: [ZakazService, ShopService],
  controllers: [ZakazController],
  exports: [ZakazService],
})
export class ZakazModule {}
