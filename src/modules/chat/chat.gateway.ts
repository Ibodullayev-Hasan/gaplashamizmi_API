import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeUsers = new Map<string, string>();

  constructor(private readonly chatService: ChatService) { }

  // Foydalanuvchi bog‘langanida
  handleConnection(@ConnectedSocket() client: Socket) {
    // console.log(`Client connected: ${client.id}`);
  }

  // Foydalanuvchi uzilganida
  handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = [...this.activeUsers.entries()].find(([_, id]) => id === client.id)?.[0];

    if (userId) {
      this.activeUsers.delete(userId);
      console.log(`User ${userId} disconnected.`);
    }
  }


  @SubscribeMessage('send')
  async handleSend(
    @MessageBody() data: { senderId: string; receiverId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const message = await this.chatService.sendMessage(data.senderId, data.receiverId, data.text);

      // Faqat qabul qiluvchiga xabarni jo'natish
      this.server.to(data.receiverId).emit('message', message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  @SubscribeMessage('register')
  handleRegister(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    if (this.activeUsers.has(userId)) {
      return;   
    }

    this.activeUsers.set(userId, client.id); // Userni qo‘shamiz
    client.join(userId); // Uni faqat bir marta qo‘shamiz
    console.log(`User ${userId} joined room.`);
  }

}
