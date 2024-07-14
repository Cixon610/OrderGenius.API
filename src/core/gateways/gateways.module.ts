import { Module } from '@nestjs/common';
import { OrderNotifyGateway } from './order-notify/order-notify.gateway';
import { SysConfigService } from 'src/infra/services';
const exportServices = [OrderNotifyGateway, SysConfigService];
@Module({
  imports: [],
  providers: [...exportServices],
  exports: exportServices,
})
export class GatewaysModule {}
