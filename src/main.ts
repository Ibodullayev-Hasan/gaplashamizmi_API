import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, } from '@nestjs/common';
import { corsConfig, setUpGlobalFilter, setupGlobalPipes, setUpswagger } from './configs';
import { notFoundMiddleware } from './common/middlewares/not-found.middleware';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService)

    app.setGlobalPrefix('api/v1')

    corsConfig(app)
    setUpswagger(app)
    setupGlobalPipes(app)
    setUpGlobalFilter(app)


    const port = configService.get<number>('SERVER_PORT') ?? 5000;
    
    app.use('*/api/v1/', notFoundMiddleware); 
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
