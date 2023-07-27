import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { ZakazModule } from '../zakaz/zakaz.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [ZakazModule, FileModule],
  providers: [ShopService],
  controllers: [ShopController],
  exports: [ShopService],
})
export class ShopModule {}
