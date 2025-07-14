import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from "@nestjs/cache-manager"
import { EmailModule } from './modules/email/email.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cacheManagerConfig, envConfig, JwtConfig } from './configs';
import { DomenMiddleware } from './common/middlewares/domen.middleware';
import { ChatModule } from './modules/chat/chat.module';

import dbConfigDev from './database/configs/db.config';
import dbConfigProd from './database/configs/db.config.pro';
import { AllexceptionFilter } from './common/filters';


@Module({
  imports: [
    
    ConfigModule.forRoot(envConfig),

    JwtModule.registerAsync(JwtConfig),

    TypeOrmModule.forRootAsync({
      useFactory: async () => process.env.NODE_ENV === 'production' ? dbConfigProd() : dbConfigDev()
    }),

    CacheModule.registerAsync(cacheManagerConfig),

    UsersModule,
    AuthModule,
    EmailModule,
    ChatModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllexceptionFilter
    }
  ],
  exports: [CacheModule, JwtModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DomenMiddleware).forRoutes("*")
  }
}
