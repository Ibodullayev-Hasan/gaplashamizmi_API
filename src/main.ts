import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, } from '@nestjs/common';
import { corsConfig, setupGlobalPipes, setUpswagger } from './configs';
import { NotFoundExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService)

    app.setGlobalPrefix('api/v1')

    corsConfig(app)
    setUpswagger(app)
    setupGlobalPipes(app)

    app.useGlobalFilters(new NotFoundExceptionFilter())

    const port = configService.get<number>('SERVER_PORT') ?? 5000;

    await app.listen(port);
    console.log(`Server run 🚀 port:${port}`);
  } catch (error: any) {
    if (error instanceof HttpException) {
      throw error
    }
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
bootstrap();
