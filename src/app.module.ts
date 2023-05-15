import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZakazModule } from './zakaz/zakaz.module';
import { ShopModule } from './shop/shop.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static', 'uploads'),
      serveRoot: '/static/uploads',
    }),
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    PrismaModule,
    ZakazModule,
    ShopModule,
    ProductModule,
    SchedulerModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
