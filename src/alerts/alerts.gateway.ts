import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseInterceptors } from '@nestjs/common';

import { RedisPropagatorInterceptor } from '../shared/redis-propagator/redis-propagator.interceptor';
import { RedisPropagatorService } from 'src/shared/redis-propagator/redis-propagator.service';

@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway({ namespace: '/alert' })
export class AlertsGateway {

  constructor(private readonly redisPropagatorService: RedisPropagatorService) {}

  @SubscribeMessage('joinRoom')
  joinRoom(socket: Socket) {
    socket.join('identifier_f');
    return { event: 'joinRoom', data: 'identifier_f' };
  }

  sendToAll(message: string) {
    this.redisPropagatorService.emitToAll({
      data: message,
      event: 'alertToClient',
    });
  }

  sendToAllInRoom(message: string) {
    this.redisPropagatorService.emitToAll({
      data: message,
      event: 'alertToClient',
      room: 'identifier_f',
    });
  }

}
