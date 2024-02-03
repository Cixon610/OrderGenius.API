import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { OrderCreateReqVo } from 'src/core/models';
import { RedisService } from 'src/infra/services';

@Injectable()
export class ShoppingCartService {
  constructor(private readonly redisService: RedisService) {}

  async get(businessId: string, userId: string): Promise<OrderCreateReqVo> {
    const key = this.#getRedisKey(businessId, userId);
    let value = await this.redisService.getT(key, OrderCreateReqVo);
    if (!value) {
      const newValue = new OrderCreateReqVo();
      await this.redisService.setT(key, newValue);
      value = newValue;
    }

    return value;
  }

  async set(
    businessId: string,
    userId: string,
    value: OrderCreateReqVo,
  ): Promise<boolean> {
    const key = this.#getRedisKey(businessId, userId);
    return await this.redisService.setT(key, value);
  }

  #getRedisKey(businessId: string, userId: string): string {
    return `shopping-cart-${businessId}-${userId}`;
  }
}
