import { ForbiddenException, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

export class DomenMiddleware implements NestMiddleware {

	private readonly allowedDomains = ['gaplashamizmi-api.up.railway.app', 'localhost']
	use(req: Request, res: Response, next: (error?: Error | any) => void) {
		const host = req.headers.host?.split(':')[0];

		if (!this.allowedDomains.includes(host)) {
			throw new ForbiddenException('Access denied: Unauthorized domain');
		}

		next();
	}
}