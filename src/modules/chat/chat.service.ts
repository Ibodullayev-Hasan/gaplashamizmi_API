// src/modules/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../database/entities';
import { WsException } from '@nestjs/websockets';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepo: Repository<Chat>,
    @InjectRepository(Message) private readonly messageRepo: Repository<Message>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async sendMessage(senderId: string, receiverId: string, text: string): Promise<Message> {
    let chat = await this.chatRepo.findOne({
      where: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    if (!chat) {
      chat = this.chatRepo.create({ senderId, receiverId });
      chat = await this.chatRepo.save(chat);
    }

    const newMessage = this.messageRepo.create({ senderId, text, chat });
    return await this.messageRepo.save(newMessage);
  }

  async getChatMessages(userId: string, withUserId: string): Promise<Message[]> {
    const chat = await this.chatRepo.findOne({
      where: [
        { senderId: userId, receiverId: withUserId },
        { senderId: withUserId, receiverId: userId },
      ],
    });

    if (!chat) return [];

    return this.messageRepo.find({
      where: { chat: { id: chat.id } },
      order: { createdAt: 'ASC' },
    });
  }

  async validateUserFromToken(token: string): Promise<User> {
    if (!token) throw new WsException({ message: `Token yo'q`, statusCode: 401 });

    try {
      const bytes = CryptoJS.AES.decrypt(token, process.env.AES_KEY);
      const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedToken) throw new WsException({ message: `Tokenni yechib bo‘lmadi`, statusCode: 400 });

      const decoded = await this.jwtService.verify(decryptedToken, {
        secret: process.env.SECRET_KEY,
      });

      const user = await this.userRepo.findOne({ where: { id: decoded.sub } });
      if (!user) throw new WsException({ message: `Foydalanuvchi topilmadi`, statusCode: 401 });

      return user;
    } catch (err: any) {
      throw new WsException(err.message);
    }
  }


  // 
  async getOrCreateChatRoomId(userA: string, userB: string): Promise<string> {
    try {
      let chat = await this.chatRepo.findOne({
        where: [
          { senderId: userA, receiverId: userB },
          { senderId: userB, receiverId: userA },
        ],
      });

      if (!chat) {
        chat = this.chatRepo.create({ senderId: userA, receiverId: userB });
        chat = await this.chatRepo.save(chat);
      }

      return `chat_${chat.id}`;


    } catch (error: any) {
      throw new WsException(error.message)
    }
  }


  // recent users
  async recentUsers(currentUserId: string): Promise<{ user: User, lastMessage: Message }[]> {
    try {
      // Foydalanuvchi ishtirok etgan barcha chatlar
      const chats = await this.chatRepo.find({
        where: [
          { senderId: currentUserId },
          { receiverId: currentUserId },
        ],
        relations: ['message'],
      });

      const result = [];

      for (const chat of chats) {
        const otherUserId =
          chat.senderId === currentUserId ? chat.receiverId : chat.senderId;

        const otherUser = await this.userRepo
          .createQueryBuilder("user")
          .select(["user.id", "user.full_name", "user.avatar_uri", "user.email", "user.is_online"])
          .where("user.id = :id", { id: otherUserId })
          .getOne();

        const lastMessage = await this.messageRepo.findOne({
          where: { chat: { id: chat.id } },
          order: { createdAt: 'DESC' },
        });

        if (otherUser && lastMessage) {
          result.push({ user: otherUser, lastMessage });
        }
      }

      // oxirgi xabar vaqti bo‘yicha sortlash
      return result.sort((a, b) =>
        b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime(),
      );
    } catch (error: any) {
      throw new WsException(error.message);
    }
  }

  async updateUserOnlineStatus(userId:string, isOnline:boolean):Promise<void>{
    try {
      await this.userRepo.update(userId, {is_online:isOnline})
    } catch (error:any) {
      throw new WsException(error.message);      
    }
  }

}
