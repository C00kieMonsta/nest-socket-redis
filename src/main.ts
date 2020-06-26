import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SocketStateService } from './shared/socket-state/socket-state.service';
import { SocketStateAdapter } from './shared/socket-state/socket-state.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const socketStateService = app.get(SocketStateService);
  app.useWebSocketAdapter(new SocketStateAdapter(socketStateService));

  await app.listen(3000);
}
bootstrap();
