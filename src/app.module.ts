import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { SendEmailModule } from './send_email/send_email.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: "postgres",
        url: configService.get<string>("DATABASE_URL"),
        synchronize: true,
        logging: false,
        entities: [
          User
        ],
        autoLoadEntities: true
      }),

      inject: [ConfigService]
    }),
    
    UsersModule,
    AuthModule,
    SendEmailModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }