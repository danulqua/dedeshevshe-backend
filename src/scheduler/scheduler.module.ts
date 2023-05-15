import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';

// Scheduler Module
@Module({
  providers: [SchedulerService],
})
export class SchedulerModule {}
