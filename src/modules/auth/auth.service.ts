import { ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/entities';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from "bcryptjs"
import { TokenGenerator } from '../../common/services/token.generator';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {

	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
		private readonly tokenService: TokenGenerator,

	) { }

	// register
	async create(createUserDto: CreateUserDto): Promise<{
		user: Omit<User, "password">,
		accToken: string,
		refToken: string,
	}> {
		try {

			const [user, hashedPassword] = await Promise.all([
				this.userRepo.findOne({ where: { email: createUserDto.email } }),
				bcryptjs.hash(createUserDto.password, 10)
			])

			if (user) throw new ConflictException(`Bu email oldin ro'yxatdan o'tgan!`)

			createUserDto.password = hashedPassword

			const newUser = this.userRepo.create({
				...createUserDto,
				user_profile: {},
				saved_messages: {}
			});

			const savedUser = await this.userRepo.save(newUser);
			const tokens = await this.tokenService.generator(savedUser);

			const { password, ...result } = savedUser;

			return { user: result, accToken: tokens.accToken, refToken: tokens.refToken }
		} catch (error: any) {
			throw error instanceof HttpException
				? error
				: new HttpException(error.message, HttpStatus.BAD_REQUEST)
		}
	}


	// login user
	async login(loginDto: LoginDto): Promise<{ accToken: string, refToken: string }> {
		try {
			const user = await this.userRepo.findOne({ where: { email: loginDto.email } });
			if (!user) throw new UnauthorizedException(`Ro'yxatdan o'tmagan email!`);

			const comparedPass = await bcryptjs.compare(loginDto.password, user.password);
			if (!comparedPass) throw new UnauthorizedException('Invalid password');

			return this.tokenService.generator(user)
		} catch (error: any) {
			throw error instanceof HttpException
				? error
				: new HttpException(error.message, HttpStatus.BAD_REQUEST)
		}
	};

	// refresh
	async refreshToken(user: User) {
		try {
			const verifyUser = await this.userRepo.findOne({ where: { email: user.email } });
			if (!verifyUser) throw new UnauthorizedException('Unauthorized user');

			const tokens = await this.tokenService.generator(user)

			return {
				accToken: tokens.accToken,
				accessExpiresIn: tokens.accessExpiresIn
			}
		} catch (error: any) {
			throw error instanceof HttpException
				? error
				: new HttpException(error.message, HttpStatus.BAD_REQUEST)
		}
	}

}