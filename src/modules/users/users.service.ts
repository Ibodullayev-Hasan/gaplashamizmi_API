import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { SavedMessages, User, UserProfile } from '../../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Cache } from 'cache-manager';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserProfile) private readonly userProfileRepo: Repository<UserProfile>,
    @InjectRepository(SavedMessages) private readonly savedMessagesRepo: Repository<SavedMessages>,
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

  async findByName(full_name: string): Promise<Omit<User, "password">[]> {
    try {
      const users = await this.userRepo.find({
        where: { full_name: ILike(`%${full_name}%`) }
      });

      return users.map(({ password, role, ...user }) => user);
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

      // this.cache.reset()

      return users.map(({ password, role, ...user }) => user);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // user data
  async update(id: string, updateUserDto: UpdateUserDto) {
    try {

      if (!Object.keys(updateUserDto).length) {
        throw new BadRequestException(`Yangilash uchun biror maydon kiritish zarur`);
      }

      const { affected } = await this.userRepo.update(id, updateUserDto)

      return affected && affected > 0 ? 'Muvaffaqiyatli yangilandi' : 'Yangilash amalga oshmadi'
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // user profile data
  async updateUserProfile(user: User, updateUserProfileDto: UpdateUserProfileDto) {
    try {

      if (!Object.keys(updateUserProfileDto).length) {
        throw new BadRequestException(`Yangilash uchun biror maydon kiritish zarur`);
      }

      const userProfileId = user.user_profile.id

      const { affected } = await this.userProfileRepo.update(userProfileId, updateUserProfileDto)

      return affected && affected > 0 ? 'Muvaffaqiyatli yangilandi' : 'Yangilash amalga oshmadi'
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
