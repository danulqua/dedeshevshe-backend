import { Module } from '@nestjs/common';
import { ZakazService } from './zakaz.service';
import { ZakazController } from './zakaz.controller';

@Module({
  providers: [ZakazService],
  controllers: [ZakazController],
})
export class ZakazModule {}
