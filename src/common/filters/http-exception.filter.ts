import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';

export const allowedRoutes: { [path: string]: string[] } = {
  '/': ['GET'],
  '/auth/sign-up': ['POST'],
  '/auth/login': ['POST'],
  '/auth/refresh': ['POST'],
  '/auth/logout': ['POST'],
  '/users/profile': ['GET'],
};

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const cleanedPath = request.path.replace(/^\/api\/v1/, '');
    console.log(cleanedPath);
    
    const allowedMethods = allowedRoutes[cleanedPath];
    console.log(allowedMethods);

    if (!allowedMethods) {
      response.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'Route Not Found',
      });
      return;
    }

    if (!allowedMethods.includes(request.method)) {
      response.status(HttpStatus.METHOD_NOT_ALLOWED).json({
        success: false,
        message: `Method ${request.method} Not Allowed`,
      });
      return;
    }

    // Fallback, should never hit if logic above works
    response.status(HttpStatus.NOT_FOUND).json({
      success: false,
      message: 'Route Not Found',
    });
  }
}
