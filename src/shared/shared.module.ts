import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { SocketStateModule } from './socket-state/socket-state.module';
import { RedisPropagatorModule } from './redis-propagator/redis-propagator.module';

@Module({
  imports: [
    RedisModule,
    RedisPropagatorModule,
    SocketStateModule,
  ],
  exports: [
    RedisModule,
    RedisPropagatorModule,
    SocketStateModule,
  ],
})
export class SharedModule {}
