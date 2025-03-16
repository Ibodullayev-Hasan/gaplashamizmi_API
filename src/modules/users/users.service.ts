import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @Inject('CACHE_MANAGER') private cache: Cache
  ) { }


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

      // this.cache.reset()

      return users.map(({ password, role, ...user }) => user);
    } catch (error: any) {
      throw error instanceof HttpException
        ? error
        : new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 
  // async getProfile(userId: string): Promise<Omit<User, "password">[]> {
  //   try {
  //     const users = await this.userRepo.find({
  //       where: { full_name: ILike(`%${full_name}%`) }
  //     });

  //     // this.cache.reset()

  //     return users.map(({ password, role, ...user }) => user);
  //   } catch (error: any) {
  //     throw error instanceof HttpException
  //       ? error
  //       : new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  async findByEmail(email: string): Promise<Omit<User, "password">[]> {
    try {
      const users = await this.userRepo.find({
        where: { email: ILike(`%${email}%`) }
      });

      // this.cache.reset()

      return users.map(({ password, role, ...user }) => user);
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
