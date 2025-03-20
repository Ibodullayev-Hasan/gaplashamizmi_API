import { InjectRepository } from "@nestjs/typeorm";
import { Chat } from "./entities/chat.entity";
import { Repository } from "typeorm";
import { Message } from "./entities/message.entity";

export class ChatService {

  constructor(
    @InjectRepository(Chat) private readonly chatRepo: Repository<Chat>,
    @InjectRepository(Message) private readonly messageRepo: Repository<Message>,
  ) { }

  async sendMessage(senderId: string, receiverId: string, text: string): Promise<Message> {
    let chat = await this.chatRepo.findOne({
      where: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
      relations: ['message'],
    });

    if (!chat) {
      chat = this.chatRepo.create({ senderId, receiverId });
      await this.chatRepo.save(chat);
    }

    const newMessage = this.messageRepo.create({ senderId, text, chat });
    await this.messageRepo.save(newMessage);

    return newMessage;
  }
}