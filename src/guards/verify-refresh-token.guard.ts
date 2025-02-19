import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class VerifyRefreshToken implements CanActivate {

    private readonly secretKey: string
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) {
        this.secretKey = process.env.SECRET_KEY
    }

    // verify refresh token
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {

            const request = context.switchToHttp().getRequest()
            const refreshToken = request.cookie['refresh_token']

            if (!refreshToken) {
                throw new UnauthorizedException('Refresh token not found')
            }

            try {

                const decoded = await this.jwtService.verifyAsync(refreshToken, { secret: this.secretKey })
                console.log(decoded);

                return true

            } catch (err) {
                throw new UnauthorizedException('Invalid refresh token ');
            }

        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

}