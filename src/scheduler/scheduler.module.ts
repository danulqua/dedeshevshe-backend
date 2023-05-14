import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ZakazModule } from 'src/zakaz/zakaz.module';
import { ZakazService } from 'src/zakaz/zakaz.service';

@Module({
  imports: [ZakazModule],
  providers: [SchedulerService, ZakazService],
})
export class SchedulerModule {}
