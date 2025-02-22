import { Injectable, CanActivate, ExecutionContext, BadRequestException, HttpException } from '@nestjs/common';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@Injectable()
export class AuthGuard implements CanActivate {

	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			const request = context.switchToHttp().getRequest();
			const authHeader = request.headers.authorization

			if (!authHeader || !authHeader.startsWith('Bearer ')) throw new BadRequestException("A bearer token must be issued")

			const token: string = authHeader.split(" ")[1]
			console.log(token);

			return true
		} catch (error: any) {
			error instanceof HttpException
				? error
				: new HttpExceptionFilter()
		}
	}
}
