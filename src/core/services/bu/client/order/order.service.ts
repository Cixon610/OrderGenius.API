import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import {
  IUserPayload,
  MenuItemModificationDto,
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

    const caculatedOrderVo = await this.getCaculatedOrderVo(
      vo,
      userPayLoad.id,
      user.userName,
    );
    const detailDto = caculatedOrderVo.detail.map((v) => {
      return new OrderDetailDto({
        orderId: orderId,
        itemId: v.itemId,
        itemPrice: v.itemPrice,
        totalPrice: v.totalPrice,
        count: v.count,
        modification: v.modification,
        memo: v.memo,
      });
    });

    const orderDetailResult = await this.orderDetailRepository.save(detailDto);
    if (!orderDetailResult) {
      throw new Error('Order save failed');
    }

    const order = new OrderDto({
      id: orderId,
      userCId: userPayLoad.id,
      totalValue: caculatedOrderVo.totalValue,
      totalCount: caculatedOrderVo.totalCount,
      memo: vo.memo,
    });

    //存Order
    const orderResult = await this.orderRepository.save(order);
    if (!orderResult) {
      throw new Error('Order save failed');
    }

    return this.get(orderId);
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

  async getByUserId(userId: string, topN?: number): Promise<OrderResVo[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      return [];
    }

    const findCondition = topN ? { take: topN } : {};
    const orders = await this.orderRepository.find({
      where: { userCId: userId },
      order: { createdAt: 'DESC' },
      ...findCondition,
    });

    if (orders?.length == 0) {
      return [];
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
          Object.values(modification.options[0]).forEach((value) => {
            totalPrice += Number(value);
          });
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
        modification: v.modifications as MenuItemModificationDto[],
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
    });
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
      if (item) {
        orderDetailVos.push(await this.#orderDetailToVo(v, item));
      }
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
      count: orderDetail.count,
      modification: orderDetail.modification,
      memo: orderDetail.memo,
    });
  }
}
