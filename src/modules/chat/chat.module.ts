import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { UsersModule } from '../users/users.module';
import { Message } from './entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, Message]),
    forwardRef(() => UsersModule)
  ],
  providers: [ChatGateway, ChatService],
  exports: [ChatService, TypeOrmModule.forFeature([Chat, Message]),]
})
export class ChatModule { }
