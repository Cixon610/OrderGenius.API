import { Injectable } from '@nestjs/common';
import { OrderCreateReqVo, OrderResVo } from 'src/core/models';
import { RedisService } from 'src/infra/services';
import { OrderService } from '../order/order.service';

@Injectable()
export class ShoppingCartService {
  constructor(
    private readonly redisService: RedisService,
    private readonly orderService: OrderService,
  ) {}

  async get(
    businessId: string,
    userId: string,
    userName: string,
  ): Promise<OrderResVo> {
    const key = this.#getRedisKey(businessId, userId);
    let value = await this.redisService.getT(key, OrderResVo);
    if (!value) {
      const newValue = new OrderResVo({
        id: '',
        userId,
        userName,
        totalValue: 0,
        totalCount: 0,
        memo: '',
        detail: [],
      });
      await this.redisService.setT(key, newValue);
      value = newValue;
    }

    return value;
  }

  async set(
    businessId: string,
    userId: string,
    userName: string,
    value: OrderCreateReqVo,
  ): Promise<OrderResVo> {
    const key = this.#getRedisKey(businessId, userId);
    const vo = await this.orderService.getCaculatedOrderVo(
      value,
      userId,
      userName,
    );
    return (
      (await this.redisService.setT(key, vo)) &&
      (await this.redisService.getT(key, OrderResVo))
    );
  }

  #getRedisKey(businessId: string, userId: string): string {
    return `shopping-cart-${businessId}-${userId}`;
  }
}
