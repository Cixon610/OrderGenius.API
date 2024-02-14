import { Injectable } from '@nestjs/common';
import { MenuItemService } from '../../business/menu/menu.item.service/menu.item.service';
import { OrderService } from '../order/order.service';
import { MenuItemResVo } from 'src/core/models';

@Injectable()
export class RecommandService {
  constructor(
    private readonly menuItemService: MenuItemService,
    private readonly orderService: OrderService,
  ) {}

  async getItemNames(businessId: string, userId: string): Promise<string[]> {
    const order = await this.orderService.getByUserId(userId, 10);
    const orderItemNames: string[] = [];

    for (const o of order) {
      for (const detail of o.detail) {
        orderItemNames.push(detail.itemName);
      }
    }

    let promotedItems = await this.menuItemService.getPromotedItems(
      businessId,
      10,
    );

    if (promotedItems.length < 10) {
      const latest10Item = await this.menuItemService.getByBusinessId(
        businessId,
      );
      promotedItems = promotedItems.concat(
        latest10Item.splice(0, 10 - promotedItems.length),
      );
    }

    for (const item of promotedItems) {
      orderItemNames.push(item.name);
    }

    return Array.from(new Set(orderItemNames)).splice(0, 10);
  }

  async getItem(businessId: string, userId: string): Promise<MenuItemResVo[]> {
    //TODO:移除重複的品項，推薦機制要再想
    //應該要先取order item的name再與該店家商品查找類似的商品
    const order = await this.orderService.getByUserId(userId, 10);
    const orderItemIds: string[] = [];
    for (const o of order) {
      for (const detail of o.detail) {
        if (orderItemIds.includes(detail.itemId)) continue;
        orderItemIds.push(detail.itemId);
      }
    }

    const orderItems = await this.menuItemService.getByItemIds(orderItemIds);

    const promotedItems = await this.menuItemService.getPromotedItems(
      businessId,
      10,
    );
    for (const item of promotedItems) {
      if (orderItems.length >= 10) break;
      if (orderItems.some((x) => x.id === item.id)) continue;
      orderItems.push(item);
    }

    const latest10Item = await this.menuItemService.getByBusinessId(
      businessId,
      10,
    );
    for (const item of latest10Item) {
      if (orderItems.length >= 10) break;
      if (orderItems.some((x) => x.id === item.id)) continue;
      orderItems.push(item);
    }

    for (const item of promotedItems) {
      if (orderItems.some((x) => x.id === item.id)) continue;
      orderItems.push(item);
    }

    return orderItems.splice(0, 10);
  }
}
