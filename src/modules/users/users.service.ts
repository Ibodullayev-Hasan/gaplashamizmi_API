import { ConflictException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
import * as bcryptjs from "bcryptjs"
import { TokenGenerator } from 'src/common/helpers/token.generator';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly tokenService: TokenGenerator,
    @Inject('CACHE_MANAGER') private cache: Cache
  ) { }

  // create user
  async create(createUserDto: CreateUserDto): Promise<{
    createdUser: Omit<User, "password">,
    accToken: string,
  }> {
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

      const [savedUser, token] = await Promise.all([
        this.userRepo.save(newUser),
        this.tokenService.generator(newUser)
      ])

      const { password, ...createdUser } = savedUser

      return { createdUser, accToken: token.accToken }
    } catch (error: any) {
      throw error instanceof HttpException
        ? error
        : new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  // find all
  async findAll(): Promise<User[]> {
    try {
      const users: User[] = await this.userRepo.find()

      return users.map((user) => {
        delete user.password
        return user
      })
    } catch (error: any) {
      throw error instanceof HttpException
        ? error
        : new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  // async findByName(fullNameDto: Omit<FullNameEmailDto, "email">): Promise<Omit<User, "password">[]> {
  async findByName(full_name: string): Promise<Omit<User, "password">[]> {
    try {
      const users = await this.userRepo.find({
        where: { full_name: ILike(`%${full_name}%`) }
      });

      this.cache.reset()

      return users.map(({ password, ...user }) => user);
    } catch (error: any) {
      throw error instanceof HttpException
        ? error
        : new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findByEmail(email: string): Promise<Omit<User, "password">[]> {
    try {
      const users = await this.userRepo.find({
        where: { email: ILike(`%${email}%`) }
      });

      this.cache.reset()

      return users.map(({ password, ...user }) => user);
    } catch (error: any) {
      throw error instanceof HttpException
        ? error
        : new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
