import { ConfigModuleOptions } from "@nestjs/config"
import emailConfig from "./email.config"

export const envConfig: ConfigModuleOptions = {
	load: [emailConfig],
	isGlobal: true,
	envFilePath: '.env'
}