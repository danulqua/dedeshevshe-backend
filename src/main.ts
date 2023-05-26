import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import * as session from 'express-session';
import * as passport from 'passport';
import { PrismaClientExceptionFilter } from 'prisma/filters/prisma-client-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ProductDTO, ProductFromZakazDTO } from 'src/product/dto/product.dto';
import { ShopModule } from 'src/shop/shop.module';
import { ZakazModule } from 'src/zakaz/zakaz.module';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { SupermarketModule } from 'src/supermarket/supermarket.module';

async function bootstrap() {
  const port = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');
  app.enableCors({ origin: process.env.CLIENT_BASE_URL, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: process.env.CLIENT_BASE_URL,
      },
      resave: false,
      saveUninitialized: false,
      store: new PrismaSessionStore(new PrismaClient(), {
        checkPeriod: 1 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  app.use(passport.initialize());
  app.use(passport.session());

  // Full API documentation
  const config = new DocumentBuilder()
    .setTitle('Grocify API')
    .setDescription('The Grocify API description')
    .setVersion('1.0')
    .addTag('Grocify')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ProductDTO, ProductFromZakazDTO],
    include: [ZakazModule, ProductModule, ShopModule, AuthModule, UserModule],
  });
  SwaggerModule.setup('api/docs', app, document);

  // Public API for supermarkets
  const supermarketsConfig = new DocumentBuilder()
    .setTitle('Grocify API для сторонніх супермаркетів')
    .setDescription('Опис Grocify API для взаємодії сторонніх супермаркетів із Grocify')
    .setVersion('1.0')
    .addTag('Grocify')
    .build();
  const supermarketsDocument = SwaggerModule.createDocument(app, supermarketsConfig, {
    include: [SupermarketModule],
  });
  SwaggerModule.setup('api/supermarket', app, supermarketsDocument);

  await app.listen(port);

  console.log(`App is running on port ${port}`);
}

bootstrap();
