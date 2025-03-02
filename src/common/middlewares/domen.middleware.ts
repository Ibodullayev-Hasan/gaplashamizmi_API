import { ForbiddenException, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

export class DomenMiddleware implements NestMiddleware {

	private readonly allowedDomains = ['localhost']
	use(req: Request, res: Response, next: (error?: Error | any) => void) {
		const host = req.headers.host?.split(':')[0];
		console.log(host);		
		console.log(req.ip);		
		
		if (!this.allowedDomains.includes(host)) {
			throw new ForbiddenException('Access denied');
		}

		next();
	}
}