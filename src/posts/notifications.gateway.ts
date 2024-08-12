import {OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway} from '@nestjs/websockets';
import {AuthService} from '../auth/auth.service';
import {Customer} from "@prisma/client";

/*@WebSocketGateway(3001, { namespace: 'events' })*/
@WebSocketGateway(3008,{
   cors: {
      origin: '*'
   },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
   constructor(private authService: AuthService) {
   }

   /*  @WebSocketServer() server: Server;*/
   async handleConnection(client: any): Promise<void> {
      console.log('handleConnection-', client);

      try {
         const user: Customer =
             await this.authService.validateUserByToken(client.request.headers.authorization || '');
         await client.join(user.id.toString());
      } catch (error: Error | any) {
         client.emit('error', 'unauthorized');
         client.disconnect();
      }
   }

   async handleDisconnect(client: any): Promise<void> {
      await client.leave(client.nsp.name);
   }

   /* async sendNotificationToUser(userId: number, message: string): Promise<void> {
       this.server.to(`${userId}`).emit('notification', message);
    }*/
}
