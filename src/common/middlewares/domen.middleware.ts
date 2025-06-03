import { ForbiddenException, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

export class DomenMiddleware implements NestMiddleware {
	private readonly allowedDomains = ['localhost', 'gaplashamizmi-api.onrender.com'];
	private readonly allowedIp = ['100.64.0.2'];

	use(req: Request, res: Response, next: (error?: Error | any) => void) {
		const host = req.headers.host?.split(':')[0] || '';

		const ipAdress = req.socket.remoteAddress?.replace(/^.*:/, '') || '';

		if (!this.allowedDomains.includes(host)) {
			throw new ForbiddenException('Access denied');
		}

		next();
	}
}

