import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envConfig } from "./env.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "./db.config";

@Module({
	imports: [
		ConfigModule.forRoot(envConfig),
		TypeOrmModule.forRootAsync(databaseConfig)
	]
})

export class AppConfigModule { };