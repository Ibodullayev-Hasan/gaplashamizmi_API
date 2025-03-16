import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthGuard implements CanActivate {

	private jwtSecretKey: string
	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
		private readonly jwtService: JwtService,
	) {
		this.jwtSecretKey = process.env.SECRET_KEY
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			const request = context.switchToHttp().getRequest();
			const authHeader = request.headers.authorization

			if (!authHeader || !authHeader.startsWith('Bearer ')) {
				throw new UnauthorizedException(`Missing Authentication Token`)
			}

			let token: string = authHeader.split(" ")[1]
			if (!token) throw new UnauthorizedException(`Missing Authentication Token`)

			// AES ni deshiferlash
			const bytes = CryptoJS.AES.decrypt(token, process.env.AES_KEY)
			token = bytes.toString(CryptoJS.enc.Utf8)

			const decoded = await this.jwtService.verify(token, { secret: this.jwtSecretKey, })

			const user: User = await this.userRepo.findOne({ where: { id: decoded?.sub } })
			if (!user) throw new UnauthorizedException(`Ro'yxatdan o'tmagan user`)

			request.user = user
			return true
		} catch (error: any) {
			if (error.name === "JsonWebTokenError" || error.message === "Malformed UTF-8 data") throw new UnauthorizedException("Xato token")

			if (error.name === "TokenExpiredError") throw new UnauthorizedException("Token amal qilish muddati tugagan")

			throw error instanceof HttpException
				? error
				: new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}
}
