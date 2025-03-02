import { ForbiddenException, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

export class DomenMiddleware implements NestMiddleware {
	private readonly allowedDomains = ['localhost', 'gaplashamizmi-api.up.railway.app'];
	private readonly allowedIp = ['100.64.0.2'];

	use(req: Request, res: Response, next: (error?: Error | any) => void) {
		// Host nomini olish va portni kesib tashlash
		const host = req.headers.host?.split(':')[0] || '';

		// IP manzilni olish (IPv4 formatida)
		const ipAdress = req.socket.remoteAddress?.replace(/^.*:/, '') || '';

		console.log(`Host: ${host}`);
		console.log(`allowed: ${this.allowedIp} -> thisIp: ${ipAdress}`);

		// Ruxsat berilgan domen yoki IP bo'lmasa, xatolik chiqarish
		if (!this.allowedDomains.includes(host) || !this.allowedIp.includes(ipAdress)) {
			throw new ForbiddenException('Access denied');
		}

		next();
	}
}
