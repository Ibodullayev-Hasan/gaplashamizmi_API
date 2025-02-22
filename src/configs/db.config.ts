import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User, UserProfile } from "../entities"

export const databaseConfig: TypeOrmModuleAsyncOptions = {
	useFactory: async (configService: ConfigService) => ({
		type: 'postgres',
		url: configService.get<string>('DATABASE_URL'), // .env dan olinadi
		synchronize: true,       // Rivojlantirishda true, ishlab chiqarishda false
		logging: false,          // Logging kerak bo‘lsa true qilinadi
		autoLoadEntities: true,  // Avtomatik entity yuklash
		entities: [User, UserProfile],
	}),
	inject: [ConfigService],
};
