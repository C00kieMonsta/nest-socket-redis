import { UseInterceptors, Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';

import { RedisPropagatorInterceptor } from './shared/redis-propagator/redis-propagator.interceptor';
import { SocketStateService } from './shared/socket-state/socket-state.service';

@WebSocketGateway()
@UseInterceptors(RedisPropagatorInterceptor)
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(private readonly socketService: SocketStateService) {}

  private logger: Logger = new Logger('Test Gateway');

  afterInit(server: Server) {
    this.logger.log('Init Test Gateway');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.socketService.addUserToSocket('1234', client);
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.socketService.removeUserFromSocket('1234', client);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('events')
  public findAll(): Observable<any> {
    return from([1, 2, 3]).pipe(
      map((item) => {
        return { event: 'events', data: `Apple type is ${item}` };
      }),
    );
  }
}
