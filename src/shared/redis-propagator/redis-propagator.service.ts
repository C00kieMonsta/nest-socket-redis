import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { tap } from 'rxjs/operators';

import { SocketStateService } from '../socket-state/socket-state.service';
import { RedisService } from '../redis/redis.service';
import {
  REDIS_SOCKET_EVENT_SEND_NAME,
  REDIS_SOCKET_EVENT_EMIT_ALL_NAME,
  REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME,
} from '../constants';

interface RedisSocketEventEmit {
  readonly event: string;
  readonly room?: string;
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
  ) {
    // we would also like to listen to the events coming from other instances and act on it
    this.redisService
      .fromEvent(REDIS_SOCKET_EVENT_SEND_NAME)
      .pipe(tap(this.consumeSendEvent))
      .subscribe();

    this.redisService
      .fromEvent(REDIS_SOCKET_EVENT_EMIT_ALL_NAME)
      .pipe(tap(this.consumeEmitToAllEvent))
      .subscribe();

    this.redisService
      .fromEvent(REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME)
      .pipe(tap(this.consumeEmitToAuthenticatedEvent))
      .subscribe();
  }

  // this method will be called each time our socket server dispatches an event to the frontend client
  public propagateEvent(eventInfo: RedisSocketEventSend): boolean {
    if (!eventInfo.userId) {
      return false;
    }
    this.redisService.publish(REDIS_SOCKET_EVENT_SEND_NAME, eventInfo);
    return true;
  }

  public emitToAuthenticated(eventInfo: RedisSocketEventEmit): boolean {
    this.redisService.publish(REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME, eventInfo);
    return true;
  }

  public emitToAll(eventInfo: RedisSocketEventEmit): boolean {
    this.redisService.publish(REDIS_SOCKET_EVENT_EMIT_ALL_NAME, eventInfo);
    return true;
  }

  // this method lets us inject a WebSocket server instance into our service
  public injectSocketServer(server: Server): RedisPropagatorService {
    this.socketServer = server;
    return this;
  }

  /**
   * Method listening to the Redis event that tells us to send an event to a specified user.
   * @eventInfo includes following info:
   * - userId; where to send the event
   * - event; name of event
   * - data; what data it should contain
   * - socketId; which socket the event originated from
   * Inside the interceptor, we use the propagateEvent method to send the event across all of our instances
   */
  private consumeSendEvent = (eventInfo: RedisSocketEventSend): void => {
    const { userId, event, data, socketId } = eventInfo;
    return this.socketStateService
      .getSocketsByUserId(userId)
      // making sure we are not sending the same event twice by filtering the sockets by the provided socketId
      .filter((socket) => socket.id !== socketId)
      // using the emit method of each socket to send the event
      .forEach((socket) => socket.emit(event, data));
  }

  /**
   * This method uses the emit method of the socket server to emit the event to all currently open connections,
   * authenticated or not
   */
  private consumeEmitToAllEvent = (eventInfo: RedisSocketEventEmit): void => {
    const { event, data, room } = eventInfo;
    if (room) {
      this.socketServer.to(room).emit(event, data);
    } else {
      this.socketServer.emit(event, data);
    }
  }

  /**
   * After getting all the authenticated sockets we use the emit method of the socket to send the event
   */
  private consumeEmitToAuthenticatedEvent = (eventInfo: RedisSocketEventEmit): void => {
    const { event, data, room } = eventInfo;
    if (room) {
      this.socketStateService.getAllSockets().forEach((socket) => socket.to(room).emit(event, data));
    } else {
      this.socketStateService.getAllSockets().forEach((socket) => socket.emit(event, data));
    }
  }

}
