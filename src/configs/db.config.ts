import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SavedMessages, User, UserProfile } from "../entities"

export const databaseConfig: TypeOrmModuleAsyncOptions = {
	useFactory: async (configService: ConfigService) => ({
		type: 'postgres',
		url: configService.get<string>('DATABASE_URL'), 
		synchronize: true,      
		logging: false,          
		autoLoadEntities: true,  
		entities: [
			User,
			UserProfile,
			SavedMessages,
		],
	}),
	inject: [ConfigService],
};
