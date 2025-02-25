import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcryptjs from "bcryptjs"

@Injectable()
export class UsersService {

  private accessTime: string
  private jwtSecretKey: string

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService
  ) {
    this.accessTime = process.env.JWT_ACCESS_EXPIRES_TIME;
    this.jwtSecretKey = process.env.SECRET_KEY;
  }

  // create user
  async create(createUserDto: CreateUserDto): Promise<{ result: Omit<User, "password">, accToken: string }> {
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

      const savedUser = await this.userRepo.save(newUser);

      const payload: object = { sub: savedUser.id, email: savedUser.email }
      const accToken: string = this.jwtService.sign(payload, { secret: this.jwtSecretKey, expiresIn: this.accessTime })

      const { password, ...result } = savedUser

      return { result, accToken }
    } catch (error: any) {
      throw error instanceof HttpException
        ? error
        : new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepo.find({
      relations: {
        user_profile: true,
        saved_messages: true
      }
    });
    console.log(users.map((el) => {
      delete el.password
      return el
    }));
    console.log('sad');
    
    return users
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
