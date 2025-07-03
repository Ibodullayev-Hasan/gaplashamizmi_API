import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, VersioningType } from '@nestjs/common';
import { corsConfig, setupGlobalPipes, setUpswagger } from './configs';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createWinstonLogger } from './common/services/logger';
import { RoutesExceptionFilter } from './common/filters';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: createWinstonLogger()
  });
  const logger = new Logger('Gaplashamizmi-api');

try{

    const configService = app.get(ConfigService);
    const port = configService.get<number>('SERVER_PORT') ?? 5000;

    app.setGlobalPrefix(configService.get<string>("PREFIX"))
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: configService.get<string>("VERSION") })

    corsConfig(app);
    setUpswagger(app);
    setupGlobalPipes(app);


    // NestJS HTTP serverini olish
    const httpServer = app.getHttpServer();

    // WebSocket uchun adapter o‘rnatish
    app.useWebSocketAdapter(new IoAdapter(httpServer));

    app.useGlobalFilters(new RoutesExceptionFilter());

    // HTTP va WebSocket bitta portda ishlaydi
    await app.listen(port);
    logger.log(`Server run on port:${port} 🚀`);
  } catch (error: any) {
    logger.error(error.message)
  }
}

bootstrap();
