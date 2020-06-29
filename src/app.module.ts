import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
// import { ChatGateway } from './chat/chat.gateway';
// import { AlertsGateway } from './alerts/alerts.gateway';
// import { AlertsController } from './alerts/alerts.controller';

@Module({
  imports: [SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
