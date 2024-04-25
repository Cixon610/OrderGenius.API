import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MenuItemModificationDto,
  OrderCreateReqVo,
  OrderDetailVo,
  OrderResVo,
} from 'src/core/models';
import { RedisService } from 'src/infra/services';
import { MenuItem } from 'src/infra/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly itemRepository: Repository<MenuItem>,
    private readonly redisService: RedisService,
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
        businessId,
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
    const vo = await this.getCaculatedOrderVo(value, userId, userName);
    return (
      (await this.redisService.setT(key, vo)) &&
      (await this.redisService.getT(key, OrderResVo))
    );
  }

  async clear(businessId: string, userId: string): Promise<boolean> {
    return this.redisService.delete(this.#getRedisKey(businessId, userId));
  }

  async getCaculatedOrderVo(
    vo: OrderCreateReqVo,
    userId: string,
    userName: string,
  ): Promise<OrderResVo> {
    const orderDetailList: OrderDetailVo[] = [];
    for (const v of vo.detail) {
      const item = await this.itemRepository.findOne({
        where: { id: v.itemId },
      });

      //計算總價
      let totalPrice = Number(item.price * v.count);
      if (v.modifications) {
        v.modifications.forEach((modification) => {
          modification.options.forEach((option) => {
            totalPrice += Number(option.price);
          });
          // Object.values(modification.options[0]).forEach((value) => {
          //   totalPrice += Number(value);
          // });
        });
      }

      const orderDetailDto = new OrderDetailVo({
        itemId: v.itemId,
        itemName: item.name,
        itemDescription: item.description,
        itemPrice: +item.price,
        itemPictureUrl: item.pictureUrl,
        totalPrice: +totalPrice,
        count: v.count,
        modifications: v.modifications as MenuItemModificationDto[],
        memo: v.memo,
      });

      orderDetailList.push(orderDetailDto);
    }

    const totalValue = orderDetailList.reduce((a, b) => a + b.totalPrice, 0);
    const totalCount = orderDetailList.reduce((a, b) => a + b.count, 0);

    return new OrderResVo({
      id: '',
      detail: orderDetailList,
      totalValue: totalValue,
      totalCount: totalCount,
      memo: vo.memo,
      userId: userId,
      userName: userName,
      businessId: vo.businessId,
    });
  }

  #getRedisKey(businessId: string, userId: string): string {
    return `shopping-cart:${businessId}:${userId}`;
  }
}
