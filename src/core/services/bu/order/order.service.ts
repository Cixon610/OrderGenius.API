import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OrderCreateReqVo,
  OrderDetailDto,
  OrderDetailVo,
  OrderDto,
  OrderResVo,
} from 'src/core/models';
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

    let orderResult = await this.orderRepository.save(order);

    let orderDetailList = [];
    for (const v of vo.detail) {
      const item = await this.itemRepository.findOne({
        where: { id: v.itemId },
      });

      //計算總價
      let totalPrice = Number(item.price);
      if (v.modification && v.modification.pricing) {
        for (const value of Object.values(v.modification.options)) {
          totalPrice += Number(value);
        }
      }

      const orderDetailDto = new OrderDetailDto({
        orderId: orderResult.id,
        itemId: v.itemId,
        itemPrice: item.price,
        totalPrice: totalPrice,
        modification: v.modification as Object,
        memo: v.memo,
      });

      orderDetailList.push(orderDetailDto);
    }

    const orderDetailResult = await this.orderDetailRepository.save(
      orderDetailList,
    );

    //存Order
    order.totalValue = orderDetailList.reduce((a, b) => a + b.totalPrice, 0);
    order.totalCount = orderDetailList.length;
    orderResult = await this.orderRepository.save(order);

    return new OrderResVo({
      id: orderResult.id,
      detail: orderDetailResult,
      userCId: orderResult.userCId,
      totalValue: orderResult.totalValue,
      totalCount: orderResult.totalCount,
      memo: orderResult.memo,
    });
  }

  async get(id: string): Promise<OrderResVo> {
    const order = await this.orderRepository.findOne({
      where: { id },
    });
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }
    const orderDetails = await this.orderDetailRepository.find({
      where: { orderId: id },
    });

    const orderDetailVos = [];
    for (const v of orderDetails) {
      const item = await this.itemRepository.findOne({
        where: { id: v.itemId },
      });
      orderDetailVos.push(await this.orderDetailToVo(v, item));
    }

    return new OrderResVo({
      id: order.id,
      detail: orderDetailVos,
      userCId: order.userCId,
      totalValue: order.totalValue,
      totalCount: order.totalCount,
      memo: order.memo,
    });
  }

  async orderToVo(order: Order): Promise<OrderResVo> {
    if (!order) {
      return null;
    }
    return new OrderResVo({
      id: order.id,
      userCId: order.userCId,
      totalValue: order.totalValue,
      totalCount: order.totalCount,
      memo: order.memo,
      detail: null,
    });
  }

  async orderDetailToVo(
    orderDetail: OrderDetail,
    item,
  ): Promise<OrderDetailVo> {
    if (!orderDetail) {
      return null;
    }
    return new OrderDetailVo({
      itemId: orderDetail.itemId,
      itemName: item.name,
      itemDescription: item.description,
      itemPrice: orderDetail.itemPrice,
      itemPictureUrl: item.pictureUrl,
      totalPrice: orderDetail.totalPrice,
      modification: orderDetail.modification,
      memo: orderDetail.memo,
    });
  }
}
