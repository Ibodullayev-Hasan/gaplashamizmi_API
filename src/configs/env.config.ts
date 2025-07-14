import { ConfigModuleOptions } from "@nestjs/config"
import emailConfig from "./email.config"
import dbConfigDev from '../database/configs/db.config';
import dbConfigProd from '../database/configs/db.config.pro';

export const envConfig: ConfigModuleOptions = {
	load: [emailConfig, dbConfigDev, dbConfigProd],
	isGlobal: true,
	envFilePath: `.env.${process.env.NODE_ENV}`
}