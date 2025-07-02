// gateway/chat.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({ cors: true, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeUsers = new Map<string, string>();

  constructor(
    private readonly chatService: ChatService,
  ) { }

  // ws connection
  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const user = await this.chatService.validateUserFromSocket(client);
      
      this.activeUsers.set(user.id, client.id);
      client.join(user.id);
      
      // console.log(`client joined:${client.id}`);
      this.server.emit('users', Array.from(this.activeUsers.keys()));
    } catch (error: any) {
      throw new WsException(error.message);
    }
  }
  
  // ws desconnected
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = [...this.activeUsers.entries()].find(([_id, socketId]) => socketId === client.id)?.[0];
    if (userId) {
      this.activeUsers.delete(userId);

      // console.log(`client desconnected:${client.id}`);
      this.server.emit('users', Array.from(this.activeUsers.keys()));
    }
  }

  @SubscribeMessage('register')
  handleRegister(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    if (!this.activeUsers.has(userId)) {

      this.activeUsers.set(userId, client.id);

      client.join(userId); 

      // console.log(`client registred:${userId}`);
      
      this.server.emit('users', Array.from(this.activeUsers.keys())); // online update
    }
  }

  // send-message
  @SubscribeMessage('send-message')
  async handleSend(
    @MessageBody() data: { senderId: string; receiverId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.chatService.sendMessage(
      data.senderId,
      data.receiverId,
      data.text,
    );

    this.server.to(data.receiverId).emit('receive-message', message);
  }

  // typing
  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { senderId: string; receiverId: string },
  ) {
    this.server.to(data.receiverId).emit('typing', { senderId: data.senderId });
  }

  // get history
  @SubscribeMessage('get-history')
  async handleHistory(
    @MessageBody() data: { userId: string; withUserId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const messages = await this.chatService.getChatMessages(data.userId, data.withUserId);
    client.emit('chat-history', messages);
  }
}
