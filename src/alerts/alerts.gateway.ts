import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UseInterceptors } from '@nestjs/common';

import { RedisPropagatorInterceptor } from '../shared/redis-propagator/redis-propagator.interceptor';

@WebSocketGateway({ namespace: '/alert' })
@UseInterceptors(RedisPropagatorInterceptor)
export class AlertsGateway {

  @WebSocketServer() wss: Server;

  sendToAll(message: string) {
    this.wss.emit('alertToClient', { type: 'Alert', message });
  }

}
