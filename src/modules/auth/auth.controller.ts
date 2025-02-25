import { Body, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
	private accessTime: string
	private jwtSecretKey: string

	constructor(
		private readonly authService: AuthService,
		private readonly jwtService: JwtService,
	) {
		this.jwtSecretKey = process.env.SECRET_KEY
		this.accessTime = process.env.JWT_ACCESS_EXPIRES_TIME;
	}

	@Post('login')
	async login(@Body() loginDto: LoginDto, @Res() res: Response) {
		const { accToken, refToken } = await this.authService.login(loginDto);

		res.cookie('refToken', refToken, {
			httpOnly: true,
			secure: false,         // Productionda true bo'lishi kerak
			sameSite: 'lax',
			maxAge: 1000 * 60 * 60 * 24 * 7,
		});

		return res.status(200).json({
			accToken,
			accExpirecIn: this.accessTime,
			message: 'Login successful',
		});
	}

	@Post('refresh')
	async refresh(@Req() req, @Res() res: Response) {
		const refreshToken = req.cookies['refToken'];
		if (!refreshToken) throw new UnauthorizedException('Refresh token yo‘q');

		try {
			const payload = await this.jwtService.verifyAsync(refreshToken, { secret: this.jwtSecretKey });
			const newAccessToken = await this.jwtService.signAsync({ sub: payload.sub, email: payload.email }, {
				secret: this.jwtSecretKey,
				expiresIn: this.accessTime
			});

			return res.json({ accToken: newAccessToken, accExpirecIn: this.accessTime });
		} catch (error) {
			throw new UnauthorizedException('Yaroqsiz refresh token');
		}
	}

}
