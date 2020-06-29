import { Module } from '@nestjs/common';
import { RedisPropagatorService } from './redis-propagator.service';

/**
 * This module exposes the redis propagator service responsible for
 * dispatching events across all instances of the application.
 */
@Module({
  providers: [RedisPropagatorService]
})
export class RedisPropagatorModule {}
