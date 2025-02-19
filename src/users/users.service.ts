import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInDto } from 'src/auth/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from 'src/interfaces/jwt.payload.interface';
import { Request } from 'express';
import * as bcryptjs from "bcryptjs"


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService
  ) { }


  // create user
  async create(createUserDto: CreateUserDto)
    : Promise<{ user: object, tokens: { refresh_token: string, access_token: string } }> {

    try {
      const existUser: User = await this.userRepo.findOne({ where: { email: createUserDto.email } })

      if (existUser) {
        throw new ConflictException('Already exist user. Enter a another email')
      }

      const existUserPhoneNumber: User = await this.userRepo.findOne({ where: { phone: createUserDto.phone } })

      if (existUserPhoneNumber && existUserPhoneNumber.phone === createUserDto.phone) {
        throw new ConflictException('The phone number already exists. Enter another phone number')
      }

      const newUser: User = this.userRepo.create(createUserDto)

      const payload: IJwtPayload = { sub: newUser.id, email: newUser.email }
      const tokens = {
        access_token: await this.jwtService.signAsync(payload, { secret: process.env.SECRET_KEY, expiresIn: process.env.JWT_ACCESS_EXPIRES_TIME }),

        refresh_token: await this.jwtService.signAsync(payload, {
          secret: process.env.SECRET_KEY,
          expiresIn: process.env.JWT_REFRESH_EXPIRES_TIME,
        })
      }

      // hashed password 
      const hashedPassword = await bcryptjs.hash(newUser.password, 10)

      newUser.password = hashedPassword
      const userSave = await this.userRepo.save(newUser)

      const { password, ...result } = userSave
      return {
        user: result,
        tokens: tokens
      }
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  // all users data
  async allUsersData(): Promise<User[]> {
    try {
      const users = await this.userRepo.find()

      return users.map(el => {
        delete el.password
        return el
      })
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  // search by user id
  async findOne(id: number): Promise<Partial<User>> {
    try {
      if (typeof id === "number") {
        const user = await this.userRepo.findOne({ where: { id } })

        if (!user) {
          throw new NotFoundException('User not found')
        }
        const { password, ...result } = user
        return result
      } else {
        throw new BadRequestException()
      }

    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE)
    }
  }


  // search by email
  async findByEmailAndUser(signDto: SignInDto): Promise<User> {
    try {
      const user = await this.userRepo.findOneBy({ email: signDto.email })

      if (!user) {
        throw new UnauthorizedException(` Unauthorized email`)
      }

      const checkingUserPassword = await bcryptjs.compare(signDto.password, user.password)

      if (!checkingUserPassword) {
        throw new UnauthorizedException(`Incorrect password`)
      }
      return user

    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE)
    }
  }


  // user profile
  async getMeProfile(request: Request): Promise<User> {
    try {

      const user = await this.userRepo.findOne({ where: { full_name: request.user.full_name } })
      delete user.password

      return user
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }


  // // create new user password
  // async createNewUserPassword(): Promise<any> {
  //   try {
  //     return
  //   } catch (error: any) {
  //     if (error instanceof HttpException) {
  //       throw error
  //     }
  //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
  //   }
  // }


  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
