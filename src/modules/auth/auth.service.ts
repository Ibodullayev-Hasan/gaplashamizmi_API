import { ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from "bcryptjs"
import { TokenGenerator } from 'src/common/services/token.generator';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {

	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
		private readonly tokenService: TokenGenerator,

	) { }

	// create user
	async create(createUserDto: CreateUserDto): Promise<{
		createdUser: Omit<User, "password">,
		accToken: string,
	}> {
		try {
			const user: User = await this.userRepo.findOne({ where: { email: createUserDto.email } })

			if (user) throw new ConflictException(`already existing user`)

			const hashedPass = await bcryptjs.hash(createUserDto.password, 10)

			createUserDto.password = hashedPass

			const newUser = this.userRepo.create({
				...createUserDto,
				user_profile: {},
				saved_messages: {}
			});

			const [savedUser, token] = await Promise.all([
				this.userRepo.save(newUser),
				this.tokenService.generator(newUser)
			])

			const { password, ...createdUser } = savedUser

			return { createdUser, accToken: token.accToken }
		} catch (error: any) {
			throw error instanceof HttpException
				? error
				: new HttpException(error.message, HttpStatus.BAD_REQUEST)
		}
	}


	// login user
	async login(loginDto: LoginDto) {
		try {
			const user = await this.userRepo.findOne({ where: { email: loginDto.email } });
			if (!user) throw new UnauthorizedException('Unauthorized user');

			const comparedPass = await bcryptjs.compare(loginDto.password, user.password);
			if (!comparedPass) throw new HttpException('Invalid password', HttpStatus.FORBIDDEN);

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