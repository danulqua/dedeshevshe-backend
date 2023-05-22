import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { ZakazModule } from 'src/zakaz/zakaz.module';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [ZakazModule, FileModule],
  providers: [ShopService],
  controllers: [ShopController],
  exports: [ShopService],
})
export class ShopModule {}
