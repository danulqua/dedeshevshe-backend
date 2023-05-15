import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SchedulerService {
  constructor(private prismaService: PrismaService) {}

  private readonly logger = new Logger(SchedulerService.name);
}
