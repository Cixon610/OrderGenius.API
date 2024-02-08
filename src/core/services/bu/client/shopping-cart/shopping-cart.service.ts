import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { OrderCreateReqVo, OrderResVo } from 'src/core/models';
import { RedisService } from 'src/infra/services';

@Injectable()
export class ShoppingCartService {
  constructor(private readonly redisService: RedisService) {}

  async get(businessId: string, userId: string): Promise<OrderResVo> {
    const key = this.#getRedisKey(businessId, userId);
    let value = await this.redisService.getT(key, OrderResVo);
    if (!value) {
      const newValue = new OrderResVo();
      await this.redisService.setT(key, newValue);
      value = newValue;
    }

    return value;
  }

  async set(
    businessId: string,
    userId: string,
    value: OrderResVo,
  ): Promise<boolean> {
    const key = this.#getRedisKey(businessId, userId);
    return await this.redisService.setT(key, value);
  }

  #getRedisKey(businessId: string, userId: string): string {
    return `shopping-cart-${businessId}-${userId}`;
  }
}
