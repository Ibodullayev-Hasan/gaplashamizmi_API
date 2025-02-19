import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';


// jwt auth GUARD
@Injectable()
export class JwtAuthGuard implements CanActivate {

  private readonly secretKey: string
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {
    this.secretKey = process.env.SECRET_KEY
  }

  // verify user
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest()
      const authHeader = request.headers.authorization

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new NotFoundException(`Token noto'g'ri formatda!`);
      }

      const token = authHeader.split(" ")[1]
      if (!token) throw new NotFoundException(`Token topilmadi 🤷‍♂️`)

      const verifyUser = await this.jwtService.verifyAsync(token, { secret: this.secretKey })

      if (!verifyUser?.sub) {
        throw new UnauthorizedException('Token ichida foydalanuvchi ma’lumotlari yo‘q.');
      }

      const user = await this.userRepo.findOne({ where: { id: verifyUser.sub } })

      if (!user) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }

      request.user = user;
      return true;

    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token amal qilish muddati tugagan.');
      }

      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token noto‘g‘ri.');
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
}
