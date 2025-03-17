import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager"
import { EmailModule } from './modules/email/email.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cacheManagerConfig, databaseConfig, envConfig, JwtConfig } from './configs';
import { DomenMiddleware } from './common/middlewares/domen.middleware';
import { GlobalResponseFormatterInterceptor } from './common/interceptors/response-formatter.interceptor';
import { ChatModule } from './modules/chat/chat.module';


@Module({
  imports: [
    ConfigModule.forRoot(envConfig),

    JwtModule.registerAsync(JwtConfig),

    TypeOrmModule.forRootAsync(databaseConfig),

    CacheModule.registerAsync(cacheManagerConfig),

    UsersModule,
    AuthModule,
    EmailModule,
    ChatModule
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CustomCacheInterceptor
    // }
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalResponseFormatterInterceptor
    }
  ],
  exports: [CacheModule, JwtModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DomenMiddleware).forRoutes("*")
  }
}
