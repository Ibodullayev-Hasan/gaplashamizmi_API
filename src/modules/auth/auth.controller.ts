import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { AuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {

	constructor(private readonly authService: AuthService) { }

	@Post('register')
	async signUp(@Body() createUserDto: CreateUserDto) {
		return this.authService.create(createUserDto)
	}

	@Post('login')
	async login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto)
	}

	@Post('refresh')
	@UseGuards(AuthGuard)
	async refreshToken(@Req() req: Request) {
		const user = req.user
		return this.authService.refreshToken(user)
	}

}
