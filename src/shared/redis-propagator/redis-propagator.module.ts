import { Module } from '@nestjs/common';

import { RedisPropagatorService } from './redis-propagator.service';
import { RedisModule } from '../redis/redis.module';
import { SocketStateModule } from '../socket-state/socket-state.module';

/**
 * This module exposes the redis propagator service responsible for
 * dispatching events across all instances of the application.
 */
@Module({
  imports: [RedisModule, SocketStateModule],
  providers: [RedisPropagatorService],
  exports: [RedisPropagatorService],
})
export class RedisPropagatorModule { }
