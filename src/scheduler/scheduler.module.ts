import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ZakazModule } from 'src/zakaz/zakaz.module';
import { ZakazService } from 'src/zakaz/zakaz.service';
import { ShopModule } from 'src/shop/shop.module';

// Scheduler Module
@Module({
  imports: [ZakazModule, ShopModule],
  providers: [SchedulerService, ZakazService],
})
export class SchedulerModule {}
