import { Body, Controller, NotFoundException, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './sign-in.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    // sign-in user 
    @Post('sign-in')
    async signInUser(@Body() signInDto: SignInDto): Promise<{ access_token: string, refresh_token: string }> {
        return this.authService.signIn(signInDto)
    }

    // update refresh token
    @Post('refresh')
    async updateRefreshToken(@Req() req: Request): Promise<{ access_token: string, refresh_token: string }> {
        const refresh_token = req.cookies['refresh_token'];
        if (!refresh_token) {
            throw new NotFoundException('Refresh token not found');
        }
        return this.authService.updateRefreshToken(refresh_token);
    }

    // // reset password  
    // @Post('reset-pasword')
    // async reset_password(): Promise<object> { return }
}
