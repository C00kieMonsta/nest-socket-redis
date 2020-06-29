import { Module } from '@nestjs/common';

import { RedisPropagatorService } from './redis-propagator.service';
import { RedisModule } from '../redis/redis.module';

/**
 * This module exposes the redis propagator service responsible for
 * dispatching events across all instances of the application.
 */
@Module({
  imports: [RedisModule],
  providers: [RedisPropagatorService],
  exports: [RedisPropagatorService],
})
export class RedisPropagatorModule { }
