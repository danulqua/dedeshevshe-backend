import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpServer,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

type ErrorCodesStatusMapping = {
  [key: string]: number;
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
  private errorCodesStatusMap: ErrorCodesStatusMapping = {
    P2000: HttpStatus.BAD_REQUEST,
    P2003: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2025: HttpStatus.NOT_FOUND,
  };

  constructor(applicationRef?: HttpServer) {
    super(applicationRef);
  }

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.catchClientKnownRequestError(exception, host);
    } else {
      // Default 500 error
      super.catch(exception, host);
    }
  }

  private catchClientKnownRequestError(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const statusCode = this.errorCodesStatusMap[exception.code];
    const message =
      `[${exception.code}]: ` + this.exceptionShortMessage(exception.message);

    if (!Object.keys(this.errorCodesStatusMap).includes(exception.code)) {
      return super.catch(exception, host);
    }

    super.catch(new HttpException({ statusCode, message }, statusCode), host);
  }

  private exceptionShortMessage(message: string): string {
    const shortMessage = message.substring(message.indexOf('→'));
    return shortMessage
      .substring(shortMessage.indexOf('\n'))
      .replace(/\n/g, '')
      .trim();
  }
}
