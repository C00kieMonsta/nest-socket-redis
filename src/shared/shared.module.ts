import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { SocketStateModule } from './socket-state/socket-state.module';

@Module({
  imports: [RedisModule, SocketStateModule]
})
export class SharedModule {}
