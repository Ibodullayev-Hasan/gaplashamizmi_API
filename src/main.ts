import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as cookie_parser from "cookie-parser"

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    app.use(cookie_parser())

    app.setGlobalPrefix('api/v1')
    const configService = app.get(ConfigService)

    // 
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => {
          return {
            property: error.property,
            constraints: error.constraints,
          };
        });
        return new BadRequestException(messages);
      }
    }));

    const options = new DocumentBuilder()
      .setTitle(`GAPLASHAMIZ 😉`)
      .setDescription(`Bu "GAPLASHAMIZ 😉" loyihasi uchun API dokumenti`)
      .setVersion('1.0')
      .build()

    const dokument = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('api/docs/gaplashamiz', app, dokument)

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
 