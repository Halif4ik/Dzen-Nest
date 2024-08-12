import {
   WebSocketGateway,
   OnGatewayInit,
   OnGatewayConnection,
   OnGatewayDisconnect,
} from '@nestjs/websockets';
import {Logger} from '@nestjs/common';
import {Server, WebSocket} from 'ws';

@WebSocketGateway(3007, {cors: {origin: '*'}})
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
   private logger: Logger = new Logger('NotificationsGateway');
   private wss: Server;

   afterInit(server: Server) {
      this.wss = server;
       this.logger.log('Init');
   }

   handleConnection(client: WebSocket) {
      this.logger.log(`Client Connected: ${client}`);
      client.on('message', (message) => {
         this.logger.log(`Received message: ${message}`);
         // Echo the message back to the client
         client.send(message);
      });
   }

   handleDisconnect(client: WebSocket) {
      this.logger.log(`Client disconnected: ${client}`);
   }
}
