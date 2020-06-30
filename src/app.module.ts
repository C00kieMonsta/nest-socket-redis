import { Module } from '@nestjs/common';

import { SharedModule } from './shared/shared.module';
import { EventsGateway } from './test.gateway';
import { ChatGateway } from './chat/chat.gateway';
import { AlertsGateway } from './alerts/alerts.gateway';
import { AlertsController } from './alerts/alerts.controller';

@Module({
  imports: [SharedModule],
  controllers: [AlertsController],
  providers: [EventsGateway, ChatGateway, AlertsGateway],
})
export class AppModule {}
