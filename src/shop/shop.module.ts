import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { ZakazModule } from 'src/zakaz/zakaz.module';

@Module({
  imports: [ZakazModule],
  providers: [ShopService],
  controllers: [ShopController],
  exports: [ShopService],
})
export class ShopModule {}
