import { Module } from '@nestjs/common';
import { ZakazService } from './zakaz.service';
import { ZakazController } from './zakaz.controller';

// Zakaz Module
@Module({
  providers: [ZakazService],
  controllers: [ZakazController],
  exports: [ZakazService],
})
export class ZakazModule {}
