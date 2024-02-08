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

  async getRecommandItemNames(
    businessId: string,
    userId: string,
  ): Promise<string[]> {
    const order = await this.orderService.getByUserId(userId, 10);
    const orderItemNames: string[] = [];

    for (const o of order) {
      for (const detail of o.detail) {
        orderItemNames.push(detail.itemName);
      }
    }

    const promotedItems = await this.menuItemService.getPromotedItems(
      businessId,
    );

    for (const item of promotedItems) {
      orderItemNames.push(item.name);
    }

    return orderItemNames.splice(0, 10);
  }

  async getRecommandItem(
    businessId: string,
    userId: string,
  ): Promise<MenuItemResVo[]> {
    //TODO:移除重複的品項，推薦機制要再想
    const order = await this.orderService.getByUserId(userId, 10);
    const orderItemIds: string[] = [];
    for (const o of order) {
      for (const detail of o.detail) {
        orderItemIds.push(detail.itemId);
      }
    }

    const orderItems = await this.menuItemService.getByItemIds(orderItemIds);
    const promotedItems = await this.menuItemService.getPromotedItems(
      businessId,
    );

    orderItems.concat(promotedItems);

    return orderItems.splice(0, 10);
  }
}
