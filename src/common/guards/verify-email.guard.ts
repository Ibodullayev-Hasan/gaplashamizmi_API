import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class EmailGuard implements CanActivate {
	constructor(@Inject('CACHE_MANAGER') private cacheManager: Cache) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {

		const req = context.switchToHttp().getRequest()
		const { email } = req.body

		const verified = await this.cacheManager.get(`true-${email}`)

		if (verified !== "true-email") throw new ForbiddenException(`Tasdiqlanmagan email`)

		await this.cacheManager.del(`true-${email}`)
		return true
	}
}