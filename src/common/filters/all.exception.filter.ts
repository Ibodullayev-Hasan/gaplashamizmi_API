// src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllexceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllexceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;

    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = isHttp
      ? exception.getResponse()
      : (exception as any)?.message || 'Internal server error';

    const stack = (exception as any)?.stack;

    const errorResponse = {
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      stack: process.env.NODE_ENV !== 'production' ? stack : undefined, // Only in dev
    };

    // Terminalga to'liq log
    this.logger.error(`[${request.method}] ${request.url}`, stack);

    response.status(status).json(errorResponse);
  }
}
