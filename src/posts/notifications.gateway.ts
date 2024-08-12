import {
   ConnectedSocket,
   MessageBody, OnGatewayConnection,
   WebSocketGateway
} from '@nestjs/websockets';

@WebSocketGateway(3007, {
   cors: {origin: "*"},
   transports: ['websocket'],
})
export class NotificationsGateway implements OnGatewayConnection {
   async handleConnection(@MessageBody() data: any, @ConnectedSocket() client: any): Promise<string> {
      console.log('handleEvent-', data);
      console.log('client-', client);
      return data;
   }

   /*  @SubscribeMessage('events')
     handleEvent(@MessageBody() data: any, @ConnectedSocket() client: Socket,): string {
        console.log('handleEvent-', data);
        return data;
     }*/

}
