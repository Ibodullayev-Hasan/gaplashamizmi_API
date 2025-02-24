import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from "bcryptjs"

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
	async login(loginDto: LoginDto): Promise<{
		accToken: string;
		accExpirecIn: string
		refToken: string
		refExpirecIn: string
	}> {
		try {

			const user: User = await this.userRepo.findOne({ where: { email: loginDto.email } })
			if (!user) throw new UnauthorizedException(`Unauthorized user, please enter an authorized email address`)

			const compiredPass = await bcryptjs.compare(loginDto.password, user.password)
			if (!compiredPass) throw new HttpException(`Invalid password`, HttpStatus.FORBIDDEN)

			const payload: object = { sub: user.id, email: user.email }

			const [accToken, refToken] = await Promise.all([
				this.jwtService.signAsync(payload, { secret: this.jwtSecretKey, expiresIn: this.accessTime }),
				this.jwtService.signAsync(payload, { secret: this.jwtSecretKey, expiresIn: this.refreshTime })
			])

			return {
				accToken: accToken,
				accExpirecIn: this.accessTime,
				refToken: refToken,
				refExpirecIn: this.refreshTime
			}
		} catch (error: any) {
			throw error instanceof HttpException
				? error
				: new HttpException(error.message, HttpStatus.BAD_REQUEST)
		}
	}
}
