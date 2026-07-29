import { ForbiddenException, Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class DomenMiddleware implements NestMiddleware {
    private readonly allowedDomains: string[];

    constructor(
        private configService: ConfigService
    ) {
        const domainLocal = this.configService.getOrThrow('DOMAIN_LOCAL');
        const domainPro = this.configService.getOrThrow('DOMAIN_PRO');
        this.allowedDomains = [domainLocal, domainPro];
    }

    use(req: Request, res: Response, next:NextFunction) {
        const host = req.headers.host?.split(':')[0] || '';

        if (!this.allowedDomains.includes(host)) {
            throw new ForbiddenException('Access denied');
        }

        next();
    }
}