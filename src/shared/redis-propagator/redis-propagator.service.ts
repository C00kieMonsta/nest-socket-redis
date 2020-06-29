import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { tap } from 'rxjs/operators';

import { SocketStateService } from '../socket-state/socket-state.service';
import { RedisService } from '../redis/redis.service';
import { REDIS_SOCKET_EVENT_EMIT_ALL_AUTH, REDIS_SOCKET_EVENT_SEND_NAME, REDIS_SOCKET_EVENT_EMIT_SPECIFIC_AUTH } from '../constants';

interface RedisSocketEventEmit {
  readonly event: string;
  readonly data: any;
}

interface RedisSocketEventSend extends RedisSocketEventEmit {
  readonly userId: string;
  readonly socketId: string;
}

/**
 * The RedisPropagator Service is responsible for listening to any incoming Redis events from other instances
 * and dispatch events to them as well. We identify 2 types of events:
 * - Emit event to all open connections
 * - Emit event to all authenticated users
 * - Emit event to specific authenticated user
 */
@Injectable()
export class RedisPropagatorService {

  private socketServer: Server;

  public constructor(
    private readonly socketStateService: SocketStateService,
    private readonly redisService: RedisService,
  ) { }

  // this method will be called each time our socket server dispatches an event to the frontend client
  public propagateEvent(eventInfo: RedisSocketEventSend): boolean {
    if (!eventInfo.userId) {
      return false;
    }
    this.redisService.publish(REDIS_SOCKET_EVENT_SEND_NAME, eventInfo);
    return true;
  }

  public emitToAuthenticated(eventInfo: RedisSocketEventEmit): boolean {
    this.redisService.publish(REDIS_SOCKET_EVENT_EMIT_SPECIFIC_AUTH, eventInfo);
    return true;
  }

  public emitToAll(eventInfo: RedisSocketEventEmit): boolean {
    this.redisService.publish(REDIS_SOCKET_EVENT_EMIT_ALL_AUTH, eventInfo);
    return true;
  }

}
