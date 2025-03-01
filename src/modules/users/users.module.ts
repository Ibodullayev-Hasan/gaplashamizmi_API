import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { cacheManagerConfig, JwtConfig } from 'src/configs';
import { TokenGenerator } from 'src/common/helpers/token.generator';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync(cacheManagerConfig),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, TokenGenerator],
  exports: [UsersService, TypeOrmModule, TokenGenerator]
})
export class UsersModule { }
