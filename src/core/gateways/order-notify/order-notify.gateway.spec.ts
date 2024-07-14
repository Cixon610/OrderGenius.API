import { Test, TestingModule } from '@nestjs/testing';
import { OrderNotifyGateway } from './order-notify.gateway';

describe('OrderNotifyGateway', () => {
  let gateway: OrderNotifyGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderNotifyGateway],
    }).compile();

    gateway = module.get<OrderNotifyGateway>(OrderNotifyGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
