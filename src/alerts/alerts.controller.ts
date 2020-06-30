import { Controller, Post, HttpCode, Body } from '@nestjs/common';
import { AlertsGateway } from './alerts.gateway';

@Controller('alert')
export class AlertsController {

    constructor(private alertGateway: AlertsGateway) {}

    @Post()
    @HttpCode(200)
    createAlertToAll(@Body() dto: { message: string }) {
        this.alertGateway.sendToAll(dto.message);
        return dto;
    }

}
