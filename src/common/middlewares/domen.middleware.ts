 @Injectable()
export class DomenMiddleware implements NestMiddleware {
    private readonly allowedDomains: string[];
    private readonly domainPro: string;
    private readonly domainLocal: string;

    constructor(private configService: ConfigService) {
        this.domainLocal = this.configService.getOrThrow('DOMAIN_LOCAL');
        this.domainPro = this.configService.getOrThrow('DOMAIN_PRO');
        this.allowedDomains = [this.domainLocal, this.domainPro];
    }

    use(req: Request, res: Response, next: NextFunction) {
        const host = req.headers.host?.split(':')[0] || '';
        console.log(host);
        console.log(this.domainPro); // endi to'g'ri ishlaydi

        if (!this.allowedDomains.includes(host)) {
            throw new ForbiddenException('Access denied');
        }

        next();
    }
}