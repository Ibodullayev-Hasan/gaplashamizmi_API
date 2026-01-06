import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {

	constructor(private readonly authService: AuthService) { }

	@Post('sign-up')
	async signUp(@Body() createUserDto: CreateUserDto) {
		const data: object = await this.authService.create(createUserDto)

		return {
			success: true,
			message: 'Successfull register',
			data,
		};
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() loginDto: LoginDto) {
		const data: object = await this.authService.login(loginDto)

		return {
			success: true,
			message: 'Successfull login',
			data,
		};
	}

	@Post('refresh')
	@UseGuards(AuthGuard)
	async refreshToken(@Req() req: Request) {

		const data: object = await this.authService.refreshToken(req?.user)

		return {
			success: true,
			message: 'Token refresh',
			data,
		};
	}

}
