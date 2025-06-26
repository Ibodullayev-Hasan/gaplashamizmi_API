import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";

export function corsConfig(app: INestApplication): void {

	const configService = app.get(ConfigService);

	const corsOriginDev: string = configService.get<string>("CORS_ORIGIN_DEV") || "http://localhost:3000";
	const corsOriginPro: string = configService.get<string>("CORS_ORIGIN_PRO") || "http://localhost:3000";

	app.enableCors({
		origin: [corsOriginDev, corsOriginPro],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true
	});
	app.use(cookieParser())

}