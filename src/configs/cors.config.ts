import { INestApplication } from "@nestjs/common";
import * as cookieParser from "cookie-parser";

export function corsConfig(app: INestApplication) {
	app.enableCors({
		origin: "http://localhost:5173",
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	});
	app.use(cookieParser())

}