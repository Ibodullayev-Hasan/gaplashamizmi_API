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
	async signUp(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
		const data: object = await this.authService.create(createUserDto)

		res.status(201).json({ sucsess: true, message: 'Successfull register', data })
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() loginDto: LoginDto, @Res() res: Response) {
		const data: object = await this.authService.login(loginDto)

		res.status(200).json({ success: true, message: 'Successfull login', data })
	}

	@Post('refresh')
	@UseGuards(AuthGuard)
	async refreshToken(@Req() req: Request, @Res() res: Response) {

		const data: object = await this.authService.refreshToken(req?.user)

		res.status(200).json({ success: true, message: 'Token refresh', data })
	}

}
