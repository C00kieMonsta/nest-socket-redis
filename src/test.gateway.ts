import { UseInterceptors, Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';

import { RedisPropagatorInterceptor } from './shared/redis-propagator/redis-propagator.interceptor';
import { SocketStateService } from './shared/socket-state/socket-state.service';

@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway()
export class EventsGateway {

  constructor(private readonly socketService: SocketStateService) {}

  private logger: Logger = new Logger('Test Gateway');

  @SubscribeMessage('events')
  public findAll(): Observable<any> {
    return from([1, 2, 3]).pipe(
      map((item) => {
        return { event: 'events', data: `Item is ${item}` };
      }),
    );
  }
}
