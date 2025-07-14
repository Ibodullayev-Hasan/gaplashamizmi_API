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
import { UseFilters } from '@nestjs/common';
import { WsAllExceptionsFilter } from '../../common/filters';

@WebSocketGateway({ cors: true, namespace: '/chat' })
@UseFilters(WsAllExceptionsFilter)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeUsers = new Map<string, Set<string>>();

  constructor(private readonly chatService: ChatService) { }


  // user socket ga ulanishi
  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const token = client.handshake.query.token as string;

      if (!token) throw new WsException({ message: `Token taqdim etilmadi`, statusCode: 401 });

      const user = await this.chatService.validateUserFromToken(token);

      const sockets = this.activeUsers.get(user.id) || new Set();

      sockets.add(client.id);

      this.activeUsers.set(user.id, sockets);

      await this.chatService.updateUserOnlineStatus(user.id, true);
      this.server.emit('user-status-changed', { userId: user.id, is_online: true });

      client.join(user.id);
      this.server.emit('users', Array.from(this.activeUsers.keys()));
    } catch (error: any) {
      // token noto'g'ri bo'lsa clientga ws-error yuborish
      client.emit('ws-error', {
        success: false,
        timestamp: new Date().toISOString(),
        message: error?.message || 'Ulanishda xatolik',
        status: 400
      });

      // muhim: connectionni uzamiz
      client.disconnect(true);
    }
  }

  // typing
  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: { senderId: string; receiverId: string }) {
    this.server.to(data.receiverId).emit('typing', { senderId: data.senderId });
  }

  // 
  @SubscribeMessage('join-room')
  handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room);
  }

  // user socket dan uzilishi
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    for (const [userId, sockets] of this.activeUsers.entries()) {
      if (sockets.has(client.id)) {

        sockets.delete(client.id);

        if (sockets.size === 0) this.activeUsers.delete(userId);

        await this.chatService.updateUserOnlineStatus(userId, false);

        this.server.emit('user-status-changed', { userId, is_online: false });

        break;
      }
    }
    this.server.emit('users', Array.from(this.activeUsers.keys()));
  }

  @SubscribeMessage('send-message')
  async handleSend(
    @MessageBody() data: { senderId: string; receiverId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const message = await this.chatService.sendMessage(
        data.senderId,
        data.receiverId,
        data.text,
      );

      const room = await this.chatService.getOrCreateChatRoomId(
        data.senderId,
        data.receiverId,
      );

      // ✅ xabar yuborildi — room ichidagilarga jo‘natamiz
      this.server.to(room).emit('receive-message', message);

      // ✅ faqat o‘sha yozgan userga recent-users ni qayta yuboramiz
      const recent = await this.chatService.recentUsers(data.senderId);
      client.emit('recent-users', recent);

    } catch (error: any) {
      throw new WsException(error.message);
    }
  }



  // History
  @SubscribeMessage('get-history')
  async handleHistory(
    @MessageBody() data: { userId: string; withUserId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const messages = await this.chatService.getChatMessages(
        data.userId,
        data.withUserId,
      );

      const room = await this.chatService.getOrCreateChatRoomId(
        data.userId,
        data.withUserId,
      );

      client.join(room);

      client.emit('chat-history', { chatId: room.split("chat_")[1], messages });
    } catch (error: any) {
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('recent-users')
  async handleRecentUsers(@ConnectedSocket() client: Socket) {
    try {
      const token = client.handshake.query.token as string;

      if (!token) throw new WsException({ message: `Token taqdim etilmadi`, statusCode: 401 });

      const user = await this.chatService.validateUserFromToken(token);

      const recent = await this.chatService.recentUsers(user.id);

      client.emit('recent-users', recent);
    } catch (error: any) {
      client.emit('ws-error', {
        success: false,
        message: error?.message || 'Recent users olishda xatolik',
      });
    }
  }


};
