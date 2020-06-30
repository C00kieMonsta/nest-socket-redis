import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { RedisPropagatorService } from './redis-propagator.service';
import { AuthenticatedSocket } from '../socket-state/socket-state.adapter';

/**
 * This interceptor will have access to each socket event response, this way, we won’t have to
 * manually call propagateEvent in every one of our gateways. It subscribes to the next.handle()
 * method (Each WebSocket event sent by our server will go through here). Each dispatched event,
 * before being returned to the frontend client, is propagated across all of our instances
 * in which we send the event to all the sockets belonging to the user.
 */
@Injectable()
export class RedisPropagatorInterceptor<T> implements NestInterceptor<T, WsResponse<T>> {
  public constructor(private readonly redisPropagatorService: RedisPropagatorService) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<WsResponse<T>> {
    const socket: AuthenticatedSocket = context.switchToWs().getClient();

    return next.handle().pipe(
      tap((data) => {
        this.redisPropagatorService.propagateEvent({
          ...data,
          socketId: socket.id,
          userId: socket.auth?.userId ?? '1234',
        });
      }),
    );
  }
}
