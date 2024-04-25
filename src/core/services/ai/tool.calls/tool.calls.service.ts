import { Injectable } from '@nestjs/common';
import { RecommandService } from '../../bu/client/recommand/recommand.service';
import { OrderService } from '../../bu/client/order/order.service';
import { MenuItemService } from '../../bu/business/menu/menu.item.service/menu.item.service';
import { ShoppingCartService } from '../../bu/client/shopping-cart/shopping-cart.service';

@Injectable()
export class ToolCallsService {
  constructor(
    private readonly recommandService: RecommandService,
    private readonly orderService: OrderService,
    private readonly menuItemService: MenuItemService,
    private readonly shoppingCartService: ShoppingCartService,
  ) {}
  async getRecommand(businessId: string, userId: string) {
    const recommandItems = await this.recommandService.getItem(
      businessId,
      userId,
    );

    if (recommandItems) {
      return recommandItems.map((x) => {
        return { id: x.id, name: x.name };
      });
    }
    return [];
  }
  async getOrderHistory(userId: string, count: number) {
    const history = await this.orderService.getByUserId(userId, count);

    if (history) {
      return history.map((x) => {
        return { itemNames: x.detail.map((y) => y.itemName) };
      });
    }
    return [];
  }
  async getAllItems(businessId: string, count: number) {
    const allItems = await this.menuItemService.getByBusinessId(
      businessId,
      count,
    );

    if (allItems) {
      return allItems.map((x) => {
        return { id: x.id, name: x.name };
      });
    }
    return [];
  }
  async searchItemByKey(businessId: string, key: string) {
    const matchedItem = await this.menuItemService.getItemModificationsByKey(
      businessId,
      key,
    );

    if (matchedItem) {
      return matchedItem.map((x) => {
        return { id: x.id, name: x.name };
      });
    }
    return [];
  }
  async getItemByItemIds(businessId: string, ids: string[]) {
    const items = await this.menuItemService.getItemModificationsByItemIds(
      businessId,
      ids,
    );

    if (items) {
      return items.map((x) => {
        const modifications = x.modifications.map((y) => {
          return {
            name: y.name,
            minChoices: y.minChoices,
            maxChoices: y.maxChoices,
          };
        });

        return {
          id: x.id,
          name: x.name,
          description: x.description,
          price: x.price,
          note: x.note,
          modifications: modifications,
        };
      });
    }
    return [];
  }
  async getShoppingCart(businessId: string, userId: string, userName: string) {
    const shoppingCart = await this.shoppingCartService.get(
      businessId,
      userId,
      userName,
    );

    if (shoppingCart) {
      return shoppingCart;
    }
    return null;
  }
  async modifyShoppingCart(
    businessId: string,
    userId: string,
    userName: string,
    args: any,
  ) {
    const currentShoppingCart = await this.shoppingCartService.get(
      businessId,
      userId,
      userName,
    );
    //移除字串，AI給的錯誤資料
    args.detail = args.detail.filter((x) => typeof x !== 'string');

    //將既有購物車資料與新資料合併
    if (currentShoppingCart?.detail.length > 0) {
      args.detail = args.detail.concat(
        currentShoppingCart.detail.map((x) => {
          return {
            itemId: x.itemId,
            count: x.count,
            modifications: x.modifications,
            memo: x.memo,
          };
        }),
      );
    }

    return await this.shoppingCartService.set(
      businessId,
      userId,
      userName,
      args,
    );
  }
  async getModificationByItemId(businessId: string, id: any) {
    const item = await this.menuItemService.getItemModificationsByItemIds(
      businessId,
      [id],
    );

    return item[0].modifications.map((x) => {
      return {
        name: x.name,
        minChoices: x.minChoices,
        maxChoices: x.maxChoices,
        options: x.options,
      };
    });
  }
}
