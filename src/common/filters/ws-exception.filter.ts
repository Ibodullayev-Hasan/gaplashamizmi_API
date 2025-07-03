// src/common/filters/ws-all-exceptions.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch()
export class WsAllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(WsAllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const wsHost = host.switchToWs();
    const client = wsHost.getClient();
    const data = wsHost.getData();

    const isWsException = exception instanceof WsException;
    let message: any = isWsException
      ? exception.getError()
      : (exception as any)?.message || 'Internal server error';

    if (typeof message === 'object') {
      message = JSON.stringify(message);
    }

    const errorResponse = {
      success: false,
      timestamp: new Date().toISOString(),
      message,
      data,
      stack: process.env.NODE_ENV !== 'production' ? (exception as any)?.stack : undefined,
    };

    this.logger.error(`WS Error: ${message}`, (exception as any)?.stack);

    client.emit('ws-error', errorResponse);
  }
}