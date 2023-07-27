import * as path from 'path';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ZakazModule } from './zakaz/zakaz.module';
import { ShopModule } from './shop/shop.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FileModule } from './file/file.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WithRoles } from './auth/guards/with-roles.guard';
import { MailModule } from './mail/mail.module';
import { S3Module } from './s3/s3.module';
import { SupermarketModule } from './supermarket/supermarket.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'static', 'uploads'),
      serveRoot: '/static/uploads',
    }),
    ConfigModule.forRoot({ envFilePath: `.env.${process.env.NODE_ENV}`, isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    ZakazModule,
    ShopModule,
    ProductModule,
    SchedulerModule,
    FileModule,
    AuthModule,
    UserModule,
    MailModule,
    S3Module,
    SupermarketModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: WithRoles,
    },
  ],
})
export class AppModule {}
