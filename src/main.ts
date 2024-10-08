import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import session from 'express-session';
import passport from 'passport';
import { PrismaClientExceptionFilter } from './filters/prisma-client-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ProductDTO, ProductFromZakazDTO } from './product/dto/product.dto';
import { ShopModule } from './shop/shop.module';
import { ZakazModule } from './zakaz/zakaz.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SupermarketModule } from './supermarket/supermarket.module';

async function bootstrap() {
  const port = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule);

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
        domain: process.env.CLIENT_DOMAIN,
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
    .setTitle('DeDeshevshe API')
    .setDescription('The DeDeshevshe API description')
    .setVersion('1.0')
    .addTag('DeDeshevshe')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ProductDTO, ProductFromZakazDTO],
    include: [ZakazModule, ProductModule, ShopModule, AuthModule, UserModule],
  });
  SwaggerModule.setup('docs', app, document);

  // Public API for supermarkets
  const supermarketsConfig = new DocumentBuilder()
    .setTitle('ДеДешевше API для сторонніх супермаркетів')
    .setDescription('Опис ДеДешевше API для взаємодії сторонніх супермаркетів із ДеДешевше')
    .setVersion('1.0')
    .addTag('ДеДешевше')
    .build();
  const supermarketsDocument = SwaggerModule.createDocument(app, supermarketsConfig, {
    include: [SupermarketModule],
  });
  SwaggerModule.setup('supermarket', app, supermarketsDocument);

  await app.listen(port);

  console.log(`App is running on port ${port}`);
}

bootstrap();
