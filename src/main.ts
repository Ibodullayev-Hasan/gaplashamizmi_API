import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { corsConfig, setupGlobalPipes, setUpswagger } from './configs';
import { NotFoundExceptionFilter } from './common/filters/http-exception.filter';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('SERVER_PORT') ?? 5000;

    app.setGlobalPrefix('api/v1');

    corsConfig(app);
    setUpswagger(app);
    setupGlobalPipes(app);

    app.useGlobalFilters(new NotFoundExceptionFilter());

    // NestJS HTTP serverini olish
    const httpServer = app.getHttpServer();

    // WebSocket uchun adapter o‘rnatish
    app.useWebSocketAdapter(new IoAdapter(httpServer));

    // HTTP va WebSocket bitta portda ishlaydi
    await app.listen(port);
    console.log(`🚀 Server run: http://localhost:${port}`);
  } catch (error: any) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

bootstrap();
