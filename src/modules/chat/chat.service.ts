import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entities';
import { WsException } from '@nestjs/websockets';
import * as CryptoJS from 'crypto-js';
import { Socket } from 'socket.io';

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

  async validateUserFromSocket(client: Socket): Promise<User> {
    try {
      // console.log(client.handshake.query);
      
      const token = client.handshake.query.token as string;

      const bytes = CryptoJS.AES.decrypt(token, process.env.AES_KEY);
      
      const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);

      const decoded = await this.jwtService.verify(decryptedToken, {
        secret: process.env.SECRET_KEY
      });

      const user = await this.userRepo.findOne({ where: { id: decoded.sub } });
      if (!user) throw new WsException('Foydalanuvchi topilmadi');

      return user;
    } catch (err: any) {
      throw new WsException(err.message);
    }
  }
}
