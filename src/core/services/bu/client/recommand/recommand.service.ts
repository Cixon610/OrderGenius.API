import { Injectable } from '@nestjs/common';
import { MenuItemService } from '../../business/menu/menu.item.service/menu.item.service';
import { OrderService } from '../order/order.service';

@Injectable()
export class RecommandService {
  constructor(
    private readonly menuItemService: MenuItemService,
    private readonly orderService: OrderService,
  ) {}

  async getRecommandItems(
    userId: string,
    businessId: string,
  ): Promise<string[]> {
    const order = await this.orderService.getByUserId(userId, 10);
    const orderItemNames: string[] = [];

    for (const o of order) {
      for (const detail of o.detail) {
        orderItemNames.push(detail.itemName);
      }
    }

    return orderItemNames;
  }
}
