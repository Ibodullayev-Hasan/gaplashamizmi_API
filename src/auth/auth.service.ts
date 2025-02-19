import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from 'src/interfaces/jwt.payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    // sign in user
    async signIn(signinDto: SignInDto): Promise<{ access_token: string, refresh_token: string }> {
        try {

            const user = await this.userService.findByEmailAndUser(signinDto)

            if (!user) {
                throw new NotFoundException('User not found')
            }

            const payload: IJwtPayload = { sub: user.id, email: user.email }
            return {
                access_token: await this.jwtService.signAsync(payload, { secret: process.env.SECRET_KEY, expiresIn: process.env.JWT_ACCESS_EXPIRES_TIME }),

                refresh_token: await this.jwtService.signAsync(payload, {
                    secret: process.env.SECRET_KEY,
                    expiresIn: process.env.JWT_REFRESH_EXPIRES_TIME,
                })

            }
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE)
        }
    }


    // update refresh-token
    async updateRefreshToken(refresh_token: string): Promise<{ access_token: string, refresh_token: string }> {
        if (!refresh_token) {
            throw new NotFoundException('refresh token not found')
        }
        try {

            const decodedToken = await this.jwtService.verifyAsync(refresh_token, { secret: process.env.SECRET_KEY });
            const user = await this.userService.findOne(decodedToken.sub)

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const payload: IJwtPayload = { sub: user.id, email: user.email };

            const newAccessToken = await this.jwtService.signAsync(payload, {
                secret: process.env.SECRET_KEY,
                expiresIn: process.env.JWT_ACCESS_EXPIRES_TIME,
            });

            const newRefreshToken = await this.jwtService.signAsync(payload, {
                secret: process.env.SECRET_KEY,
                expiresIn: process.env.JWT_REFRESH_EXPIRES_TIME,
            });

            return { access_token: newAccessToken, refresh_token: newRefreshToken };

        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE)
        }
    }

    // verify refresh
    async verify_refresh() { }

}
