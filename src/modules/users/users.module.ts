import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedMessages, User, UserProfile } from '../../entities';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { cacheManagerConfig, JwtConfig } from '../../configs';
import { TokenGenerator } from '../../common/services/token.generator';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync(cacheManagerConfig),
    TypeOrmModule.forFeature([User, UserProfile, SavedMessages]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, TokenGenerator],
  exports: [
    UsersService,
    TypeOrmModule,
    TokenGenerator,
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      SavedMessages
    ]),]
})
export class UsersModule { }
