import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderCreateReqVo, OrderDetailDto, OrderDto } from 'src/core/models';
import { MenuItem, Order, OrderDetail } from 'src/infra/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(MenuItem)
    private readonly itemRepository: Repository<MenuItem>,
  ) {}

  async create(vo: OrderCreateReqVo): Promise<any> {
    const order = new OrderDto({
      userCId: vo.userId,
      memo: vo.memo,
    });
    const orderResult = await this.orderRepository.save(order);

    const orderDetailList = await vo.detail.map(async (v) => {
      const item = await this.itemRepository.findOne({ where: { id: v.itemId } });
      let totalPrice = item.price;
      if (v.modification) {
        totalPrice += v.modification.price;
      }

      const orderDetail = new OrderDetailDto({
        orderId: orderResult.id,
        itemId: v.itemId,
        itemPrice: item.price,
        totalPrice: totalPrice,
        modification: v.modification,
        memo: v.memo,
      });

      return orderDetail;
    });
    const orderDetailResult = await this.orderDetailRepository.save(
      orderDetailList,
    );
    const itemIds = vo.detail.map((v) => v.itemId);
    const items = await this.itemRepository.findByIds(itemIds);
    const result = {
      order: orderResult,
      orderDetail: orderDetailResult,
      items: items,
    };

    return result;
  }

  async get() {}
}
