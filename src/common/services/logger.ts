// src/logger/logger.ts
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp, context }) => {
	return `[${timestamp}] ${level}${context ? ` [${context}]` : ''}: ${message}`;
});

export const createWinstonLogger = () => {
	const isDev = process.env.NODE_ENV === 'development';

	return WinstonModule.createLogger({
		level: isDev ? 'debug' : 'warn',
		format: combine(
			timestamp({ format: 'HH:mm:ss' }),
			...(isDev ? [colorize({ colors: { info: "blue", error: "red", warn: "yellow", debug: "magenta", verbose: "cyan", log: "green" } })] : []),
			customFormat
		),
		transports: [new winston.transports.Console()],
	});
};
