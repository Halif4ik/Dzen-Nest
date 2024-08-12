import {
   WebSocketGateway,
   OnGatewayInit,
   OnGatewayConnection,
   OnGatewayDisconnect, WebSocketServer,
} from '@nestjs/websockets';
import {Logger} from '@nestjs/common';
import {Server, Socket} from 'socket.io';
import {AuthService} from '../auth/auth.service';
import {Customer} from "@prisma/client";
/*import {Server, WebSocket} from 'ws';*/

@WebSocketGateway(3007, {cors: {origin: '*'}})
export class NotificationsGateway implements  OnGatewayConnection, OnGatewayDisconnect {
   private logger: Logger = new Logger('NotificationsGateway');
   private wss: Server;

   constructor(private authService: AuthService) {
   }

  /* afterInit(server: Server) {
      this.wss = server;
       this.logger.log('Init');
   }

   handleConnection(client: WebSocket) {
      this.logger.log(`Client Connected: ${client}`);
      client.on('message', (message) => {
         console.log(`Received message:`, message);
         // Echo the message back to the client
         client.send(message);
      });
   }

   handleDisconnect(client: WebSocket) {
      this.logger.log(`Client disconnected: ${client}`);
   }*/
   @WebSocketServer() server: Server;
   async handleConnection(client: Socket): Promise<void> {
      try {
         console.log('authorization-', client.request.headers.authorization);
         const user: Customer =
             await this.authService.validateUserByToken(client.request.headers.authorization || '');
         console.log('Customer-', user);
         await client.join(user.id.toString());
      } catch (error: Error | any) {
         client.emit('error', 'unauthorized');
         client.disconnect();
      }
   }

   async handleDisconnect(client: Socket): Promise<void> {
      console.log('handleDisconnect-');
      await client.leave(client.nsp.name);
   }

   async sendNotificationToUser(userId: number, message: string): Promise<void> {
      this.server.to(`${userId}`).emit('notification', message);
   }
}
