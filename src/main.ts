import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import * as session from 'express-session';
import * as passport from 'passport';
import { PrismaClientExceptionFilter } from 'prisma/filters/prisma-client-exception.filter';

async function bootstrap() {
  const port = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');
  app.enableCors();
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

  await app.listen(port);

  console.log(`App is running on port ${port}`);
}

bootstrap();
