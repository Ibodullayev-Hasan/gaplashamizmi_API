import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from "bcryptjs"
import { TokenGenerator } from 'src/common/helpers/token.generator';

@Injectable()
export class AuthService {

	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
		private readonly tokenGenerator: TokenGenerator,
	) { }

	// login user
	async login(loginDto: LoginDto) {
		try {
			const user = await this.userRepo.findOne({ where: { email: loginDto.email } });
			if (!user) throw new UnauthorizedException('Unauthorized user');

			const comparedPass = await bcryptjs.compare(loginDto.password, user.password);
			if (!comparedPass) throw new HttpException('Invalid password', HttpStatus.FORBIDDEN);

			return this.tokenGenerator.generator(user)
		} catch (error: any) {
			throw error instanceof HttpException
				? error
				: new HttpException(error.message, HttpStatus.BAD_REQUEST)
		}
	};

	async refreshToken(user: User) {
		try {
			const verifyUser = await this.userRepo.findOne({ where: { email: user.email } });
			if (!verifyUser) throw new UnauthorizedException('Unauthorized user');

			return this.tokenGenerator.generator(user)
		} catch (error: any) {
			throw error instanceof HttpException
				? error
				: new HttpException(error.message, HttpStatus.BAD_REQUEST)
		}
	}

}