import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SocketStateService } from './shared/socket-state/socket-state.service';
import { SocketStateAdapter } from './shared/socket-state/socket-state.adapter';
import { RedisPropagatorService } from './shared/redis-propagator/redis-propagator.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const socketStateService = app.get(SocketStateService);
  const redisPropagatorService = app.get(RedisPropagatorService);

  app.useWebSocketAdapter(new SocketStateAdapter(app, socketStateService, redisPropagatorService));

  await app.listen(3000);
}
bootstrap();
