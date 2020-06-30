import { Module } from '@nestjs/common';

import { RedisPropagatorService } from './redis-propagator.service';
import { RedisModule } from '../redis/redis.module';


/**
 * The key to scale websockets to multiple instances without having sticky sessions, is to
 * implement a process that can talk to all instances of the app. This redis propagator is meant
 * to dispatch events across all instances of the application.
 * 
 * The redis propagator service will be listening to any incoming Redis events
 * from other instances and dispatch events to them as well. Three types of events:
 *  1. Emit to all open connections
 *  2. Emit to all authenticated users
 *  3. Emit to specific user
 */
@Module({
  providers: [RedisPropagatorService],
  exports: [RedisPropagatorService],
})
export class RedisPropagatorModule { }
