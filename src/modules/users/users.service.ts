import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SavedMessages, User, UserProfile } from '../../database/entities';
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
    // @Inject('CACHE_MANAGER') private cache: Cache
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

  // find by name
  async findByName(searchTerm: string, id: string,): Promise<Omit<User, "password">[]> {
    try {

      const users = await this.userRepo.find({
        where: [
          { full_name: ILike(`%${searchTerm.trim()}%`) }
        ],
      });

      if (users.length === 0) throw new HttpException("Not found user", HttpStatus.NOT_FOUND)

      const filteredUsersData = users.map(({ password, role, ...user }) => user).filter(user => user.id !== id)

      if (filteredUsersData.length === 0) throw new HttpException("Not found user", HttpStatus.NOT_FOUND)

      return filteredUsersData
    } catch (error: any) {
      throw error instanceof HttpException
        ? error
        : new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  // update user profile 
  async updateUserProfile(user: User, dto: UpdateUserProfileDto) {
    if (!Object.keys(dto).length) {
      throw new BadRequestException('Yangilash uchun biror maydon kiritish zarur');
    }

    const userId = user.id;
    const userProfileId = user.user_profile.id;

    const userFields = ['full_name', 'avatar_uri', 'email']; 
    const profileFields = ['chat_back_img', '']; // Related jadval

    const userUpdate: Partial<User> = {};
    const profileUpdate: Partial<UserProfile> = {};

    for (const key in dto) {
      if (userFields.includes(key)) {
        userUpdate[key] = dto[key];
      } else if (profileFields.includes(key)) {
        profileUpdate[key] = dto[key];
      }
    }

    // Transaction bilan — xavfsiz yo‘l
    const queryRunner = this.userRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (Object.keys(userUpdate).length) {
        await queryRunner.manager.update(User, userId, userUpdate);
      }

      if (Object.keys(profileUpdate).length) {
        await queryRunner.manager.update(UserProfile, userProfileId, profileUpdate);
      }

      await queryRunner.commitTransaction();
      return 'Muvaffaqiyatli yangilandi';
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }


  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
