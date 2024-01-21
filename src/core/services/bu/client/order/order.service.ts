import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import {
  IUserPayload,
  OrderCreateReqVo,
  OrderDetailDto,
  OrderDetailVo,
  OrderDto,
  OrderResVo,
} from 'src/core/models';
import { ClientUser, MenuItem, Order, OrderDetail } from 'src/infra/typeorm';
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
    @InjectRepository(ClientUser)
    private readonly userRepository: Repository<ClientUser>,
  ) {}

  async create(
    userPayLoad: IUserPayload,
    vo: OrderCreateReqVo,
  ): Promise<OrderResVo> {
    const orderId = randomUUID();

    const user = await this.userRepository.findOne({
      where: { id: userPayLoad.id },
    });

    if (!user) {
      throw new Error(`User with id ${userPayLoad.id} not found`);
    }

    let orderDetailList = [];
    for (const v of vo.detail) {
      const item = await this.itemRepository.findOne({
        where: { id: v.itemId },
      });

      //計算總價
      let totalPrice = Number(item.price * v.count);
      if (v.modifications) {
        v.modifications.forEach((modification) => {
          modification.options.forEach((value, key) => {
            totalPrice += Number(value);
          });
        });
      }

      const orderDetailDto = new OrderDetailDto({
        orderId: orderId,
        itemId: v.itemId,
        itemPrice: item.price,
        totalPrice: totalPrice,
        modification: v.modifications as Object,
        memo: v.memo,
      });

      orderDetailList.push(orderDetailDto);
    }

    const orderDetailResult = await this.orderDetailRepository.save(
      orderDetailList,
    );

    const totalValue = orderDetailList.reduce((a, b) => a + b.totalPrice, 0);
    const totalCount = orderDetailList.length;
    const order = new OrderDto({
      id: orderId,
      userCId: userPayLoad.id,
      totalValue,
      totalCount,
      memo: vo.memo,
    });

    //存Order
    const orderResult = await this.orderRepository.save(order);

    return new OrderResVo({
      id: orderResult.id,
      detail: orderDetailResult,
      totalValue: orderResult.totalValue,
      totalCount: orderResult.totalCount,
      memo: orderResult.memo,
      userId: user.id,
      userName: user.userName,
    });
  }

  async get(id: string): Promise<OrderResVo> {
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    const user = await this.userRepository.findOne({
      where: { id: order.userCId },
    });

    if (!user) {
      throw new Error(`User with id ${order.userCId} not found`);
    }

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
      orderDetailVos.push(await this.#orderDetailToVo(v, item));
    }

    return new OrderResVo({
      id: order.id,
      detail: orderDetailVos,
      totalValue: order.totalValue,
      totalCount: order.totalCount,
      memo: order.memo,
      userId: user.id,
      userName: user.userName,
    });
  }

  async getByUserId(userId: string): Promise<OrderResVo[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    const orders = await this.orderRepository.find({
      where: { userCId: userId },
      order: { createdAt: 'DESC' },
    });

    if (orders?.length == 0) {
      throw new Error(`Order with UserId ${userId} not found`);
    }

    const orderResVos = [];

    for (const order of orders) {
      const orderDetails = await this.#getOrderDetail(order.id);
      orderResVos.push(
        new OrderResVo({
          id: order.id,
          detail: orderDetails,
          totalValue: order.totalValue,
          totalCount: order.totalCount,
          memo: order.memo,
          userId: user.id,
          userName: user.userName,
        }),
      );
    }

    return orderResVos;
  }

  async #getOrderDetail(Orderid: string): Promise<OrderDetailVo[]> {
    const orderDetails = await this.orderDetailRepository.find({
      where: { orderId: Orderid },
      order: { createdAt: 'DESC' },
    });

    const orderDetailVos = [];
    for (const v of orderDetails) {
      const item = await this.itemRepository.findOne({
        where: { id: v.itemId },
      });
      orderDetailVos.push(await this.#orderDetailToVo(v, item));
    }

    return orderDetailVos;
  }

  async #orderDetailToVo(
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
