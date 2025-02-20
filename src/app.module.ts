import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';



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
        ],
        autoLoadEntities: true
      }),

      inject: [ConfigService]
    }),

  ],
  controllers: [],
  providers: [],
})
export class AppModule { }