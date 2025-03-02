import { ForbiddenException, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

export class DomenMiddleware implements NestMiddleware {

	private readonly allowedDomains = ['localhost', 'gaplashamizmi-api.up.railway.app']
	private readonly allowedIp = ['::ffff:100.64.0.2']
	use(req: Request, res: Response, next: (error?: Error | any) => void) {
		const host = req.headers.host?.split(':')[0];
		const ipAdress = req.ip

		console.log(host);
		console.log(req.ip);

		if (!this.allowedDomains.includes(host) && !this.allowedIp.includes(ipAdress)) {
			throw new ForbiddenException('Access denied');
		}

		next();
	}
}