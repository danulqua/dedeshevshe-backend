import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { FileModule } from 'src/file/file.module';

// Scheduler Module
@Module({
  imports: [FileModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
