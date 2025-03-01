import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModuleAsyncOptions } from "@nestjs/jwt";

export const JwtConfig: JwtModuleAsyncOptions = {
	global: true,
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: async (configService: ConfigService) => ({
		secret: configService.get<string>("SECRET_KEY")
	})
}