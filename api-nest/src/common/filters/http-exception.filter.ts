import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { ErrorCode } from '../errors/error-code';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const isHttp = exception instanceof HttpException;
    const status: HttpStatus = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const body = isHttp ? exception.getResponse() : null;
    const details =
      typeof body === 'object' && body !== null
        ? (body as { code?: string; message?: string | string[] })
        : {};

    response.status(status).json({
      statusCode: status,
      code:
        details.code ??
        (status === HttpStatus.BAD_REQUEST
          ? ErrorCode.VALIDATION_ERROR
          : ErrorCode.INTERNAL_ERROR),
      message: details.message ?? 'Something went wrong',
    });
  }
}
