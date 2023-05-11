import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZakazModule } from './zakaz/zakaz.module';
import { ShopModule } from './shop/shop.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    ZakazModule,
    ShopModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
