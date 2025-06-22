import { ForbiddenException, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

export class DomenMiddleware implements NestMiddleware {
	private readonly allowedDomains = ['localhost', 'gaplashamizmi-api.onrender.com', 'ibodullayevhasan.uz'];
	private readonly allowedIp = ['68.183.181.222'];

	use(req: Request, res: Response, next: (error?: Error | any) => void) {
		const host = req.headers.host?.split(':')[0] || '';

		const ipAdress = req.socket.remoteAddress?.replace(/^.*:/, '') || '';
		console.log(ipAdress);
		
		console.log(this.allowedIp.includes(ipAdress));
		
		if (!this.allowedDomains.includes(host)) {
			throw new ForbiddenException('Access denied');
		}

		next();
	}
}

