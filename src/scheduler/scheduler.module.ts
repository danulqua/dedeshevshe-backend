import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { FileModule } from '../file/file.module';
import { ShopModule } from '../shop/shop.module';
import { ZakazModule } from '../zakaz/zakaz.module';

// Scheduler Module
@Module({
  imports: [ZakazModule, FileModule, ShopModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
