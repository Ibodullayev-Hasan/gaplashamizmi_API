import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/chat', cors: { origin: true } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(private readonly chatService: ChatService) { }

  @WebSocketServer() server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    client.emit("connection", "success connected");
  }

  handleDisconnect(client: Socket) {
    client.emit("disconnection", "success disconnected");
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, message: any): void {
    console.log('Yangi xabar:', message);
    client.emit("reply", `U2FsdGVkX1/dnQNjavfTP0TAHSf27RXwDVJp9Qyixd4aK42cAE29HzIPzdNP/bxB0JpHsJD4rhtyOXkldzMcYAvQfBWmcgfBrOooAoAt+Q3WDMqeS1oZqdWcuDSeZy+kJMk9c6V+jLCnWweTAMTOV0wO/rqSFC7cgplJT0goEjMuv4zcmpi1QUrQmU6trcrbs9Qkxl6IsL0V7tSfVwjhBbVG9+seTU1FOGn2BGQ1R5gKN8XJDYtyM0567L+gcDU1l`);
  }
}
