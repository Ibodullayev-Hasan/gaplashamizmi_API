import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from "bcryptjs"
// import { Response } from 'express';

@Injectable()
export class AuthService {
	private jwtSecretKey: string
	private accessTime: string
	private refreshTime: string

	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
		private readonly jwtService: JwtService,
	) {
		this.jwtSecretKey = process.env.SECRET_KEY
		this.accessTime = process.env.JWT_ACCESS_EXPIRES_TIME;
		this.refreshTime = process.env.JWT_REFRESH_EXPIRES_TIME;
	}

	// login user

	async login(loginDto: LoginDto) {
		try {
			const user = await this.userRepo.findOne({ where: { email: loginDto.email } });
			if (!user) throw new UnauthorizedException('Unauthorized user');

			const comparedPass = await bcryptjs.compare(loginDto.password, user.password);
			if (!comparedPass) throw new HttpException('Invalid password', HttpStatus.FORBIDDEN);

			const payload = { sub: user.id, email: user.email };
			const [accToken, refToken] = await Promise.all([
				this.jwtService.signAsync(payload, { secret: this.jwtSecretKey, expiresIn: this.accessTime }),
				this.jwtService.signAsync(payload, { secret: this.jwtSecretKey, expiresIn: this.refreshTime }),
			]);

			return { accToken, refToken };
		} catch (error: any) {
			throw error instanceof HttpException
				? error
				: new HttpException(error.message, HttpStatus.BAD_REQUEST)
		}
	};

	// async refreshToken(token: string) {
	// 	try {
	// 		const user: User = this.jwtService.verify(token, { secret: this.jwtSecretKey })
	// 		console.log(user);
	// 		if (!user) throw new NotFoundException('user not found')

	// 		const payload = { sub: user.id, email: user.email };
	// 		const [accToken, refToken] = await Promise.all([
	// 			this.jwtService.signAsync(payload, { secret: this.jwtSecretKey, expiresIn: this.accessTime }),
	// 			this.jwtService.signAsync(payload, { secret: this.jwtSecretKey, expiresIn: this.refreshTime }),
	// 		]);

	// 		return { accToken, refToken };
	// 	} catch (error: any) {
	// 		throw error instanceof HttpException
	// 			? error
	// 			: new HttpException(error.message, HttpStatus.BAD_REQUEST)
	// 	}
	// }

}