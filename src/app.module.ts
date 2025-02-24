import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager"
import { EmailModule } from './modules/email/email.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './configs/db.config';
import { cacheManagerConfig, envConfig } from './configs';



@Module({
  imports: [
    ConfigModule.forRoot(envConfig),

    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY
    }),

    TypeOrmModule.forRootAsync(databaseConfig),

    CacheModule.registerAsync(cacheManagerConfig),

    UsersModule,
    AuthModule,
    EmailModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }
  ],
  exports: [CacheModule]
})
export class AppModule { }