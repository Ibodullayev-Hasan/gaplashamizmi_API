import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedMessages, User, UserProfile } from '../../database/entities';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { cacheManagerConfig, } from '../../configs';
import { TokenGenerator } from '../../common/services/token.generator';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { SpacesService } from '../../common/services/spaces.service';

@Module({
  imports: [
    ConfigModule,

    CacheModule.registerAsync(cacheManagerConfig),

    TypeOrmModule.forFeature([User, UserProfile, SavedMessages]),

    forwardRef(() => AuthModule),

    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, TokenGenerator, SpacesService],
  exports: [
    UsersService,
    TypeOrmModule,
    TokenGenerator,
    SpacesService,
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      SavedMessages
    ]),]
})
export class UsersModule { }
