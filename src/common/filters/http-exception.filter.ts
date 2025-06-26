import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { match } from 'path-to-regexp';

export const allowedRoutes: { path: string; methods: string[] }[] = [
  { path: '/', methods: ['GET'] },
  { path: '/auth/sign-up', methods: ['POST'] },
  { path: '/auth/login', methods: ['POST'] },
  { path: '/auth/refresh', methods: ['POST'] },
  { path: '/auth/logout', methods: ['POST'] },
  { path: '/users/profile', methods: ['GET'] },
  { path: '/users/name/:full_name', methods: ['GET'] }, // dinamik
];


@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const cleanedPath = request.path.replace(/^\/api\/v1/, '');
    const method = request.method;

    const matchedRoute = allowedRoutes.find(route => {
      const matcher = match(route.path, { decode: decodeURIComponent });
      const result = matcher(cleanedPath);
      const methodMatch = route.methods
        .map((m) => m.toUpperCase())
        .includes(method.toUpperCase());

      return result !== false && methodMatch;
    });

    if (!matchedRoute) {
      const routeExists = allowedRoutes.some(route => {
        const matcher = match(route.path, { decode: decodeURIComponent });
        const result = matcher(cleanedPath);
        return result !== false;
      });

      if (routeExists) {
        return response.status(HttpStatus.METHOD_NOT_ALLOWED).json({
          success: false,
          message: `Method ${method} Not Allowed`,
        });
      }

      return response.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'Route Not Found',
      });
    }

    // Fallback (optional, never hit if above logic is correct)
    return response.status(HttpStatus.NOT_FOUND).json({
      success: false,
      message: 'Route Not Found',
    });
  }
}
