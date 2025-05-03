import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as nodemailer from "nodemailer";
import { EmailController } from './email.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { cacheManagerConfig } from '../../configs';

@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync(cacheManagerConfig),
  ],
  controllers: [EmailController],
  providers: [
    {
      provide: 'MAIL_TRANSPORTER',
      useFactory: async (configService: ConfigService) => {
        return nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: configService.get<string>('email.user'),
            pass: configService.get<string>('email.pass'),
          },
        });
      },
      inject: [ConfigService],
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule { }
