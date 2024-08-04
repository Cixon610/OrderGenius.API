import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import {
  IUserPayload,
  OrderCreateReqVo,
  OrderDetailDto,
  OrderDetailVo,
  OrderDto,
  OrderQueryReqVo,
  OrderResVo,
  OrderUpdateReqVo,
} from 'src/core/models';
import { ClientUser, MenuItem, Order, OrderDetail } from 'src/infra/typeorm';
import { In, Repository } from 'typeorm';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { OrderNotifyGateway } from 'src/core/gateways/order-notify/order-notify.gateway';

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
    private readonly shoppingCartService: ShoppingCartService,
    private readonly orderNotifyGateway: OrderNotifyGateway,
  ) {}

  async create(
    userPayLoad: IUserPayload,
    vo: OrderCreateReqVo,
  ): Promise<OrderResVo> {
    //TODO: 下單要加BusinessId存進DB
    const orderId = randomUUID();

    const user = await this.userRepository.findOne({
      where: { id: userPayLoad.id },
    });

    if (!user) {
      throw new Error(`User with id ${userPayLoad.id} not found`);
    }

    const caculatedOrderVo = await this.shoppingCartService.getCaculatedOrderVo(
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
        modification: v.modifications,
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
      businessId: vo.businessId,
    });

    //存Order
    const orderResult = await this.orderRepository.save(order);
    if (!orderResult) {
      throw new Error('Order save failed');
    }

    //清空購物車
    await this.shoppingCartService.clear(vo.businessId, userPayLoad.id);
    //ws通知後台
    const orderResVo = await this.get(orderId);
    this.orderNotifyGateway.handleOrderCreated({
      businessId: vo.businessId,
      OrderVo: orderResVo,
    });

    return orderResVo;
  }

  async update(vo:OrderUpdateReqVo): Promise<boolean> {
    const order = await this.orderRepository.findOne({
      where: { id: vo.orderId },
    });

    if (!order) {
      throw new Error(`Order with id ${vo.orderId} not found`);
    }

    if (vo.tableNo) order.tableNo = vo.tableNo;
    if (vo.status) order.status = vo.status;
    if (vo.memo) order.memo = vo.memo;
    if(vo.detail){
      const orderDetails = await this.orderDetailRepository.find({
        where: { orderId: vo.orderId },
      });
      const user = await this.userRepository.findOne({
        where: { id: order.userCId },
      });
      const caculatedOrderVo =
        await this.shoppingCartService.getCaculatedOrderVo(
          vo as OrderCreateReqVo,
          user.id,
          user.userName,
        );
      for (const v of orderDetails) {
        const resd = await this.orderDetailRepository.remove(v);
      }
      const detailDto = caculatedOrderVo.detail.map((v) => {
        return new OrderDetailDto({
          orderId: vo.orderId,
          itemId: v.itemId,
          itemPrice: v.itemPrice,
          totalPrice: v.totalPrice,
          count: v.count,
          modification: v.modifications,
          memo: v.memo,
        });
      });
      const res = await this.orderDetailRepository.save(detailDto);
      //跟新主單總價
      order.totalValue = caculatedOrderVo.totalValue;
    }
    const result = await this.orderRepository.save(order);
    return !!result;
  }

  async query(query: OrderQueryReqVo): Promise<OrderResVo[]> {
    const qb = this.orderRepository.createQueryBuilder('order');
    if (query.orderId?.length > 0) {
      qb.andWhere('order.id  IN (:...orderId)', { orderId: query.orderId });
    }
    if (query.userId?.length > 0) {
      qb.andWhere('order.userCId IN (:...userId)', { userId: query.userId });
    }
    if (query.businessId) {
      qb.andWhere('order.businessId = :businessId', {
        businessId: query.businessId,
      });
    }
    if (query.tableNo?.length > 0) {
      qb.andWhere('order.tableNo IN (:...tableNo)', { tableNo: query.tableNo });
    }
    if (query.status?.length > 0) {
      qb.andWhere('order.status IN (:...status)', { status: query.status });
    }
    if (query.dateFrom) {
      qb.andWhere('order.createdAt >= :dateFrom', { dateFrom: query.dateFrom });
    }
    if (query.dateTo) {
      qb.andWhere('order.createdAt <= :dateTo', { dateTo: query.dateTo });
    }

    const orders = await qb.getMany();
    const orderIds = orders.map((v) => v.id);
    const orderDetails = await this.orderDetailRepository.find({
      where: { orderId: In(orderIds) },
    });

    const groupedOrderDetails: Record<string, OrderDetail[]> =
      orderDetails.reduce((acc, orderDetail) => {
        if (!acc[orderDetail.orderId]) {
          acc[orderDetail.orderId] = [];
        }
        acc[orderDetail.orderId].push(orderDetail);
        return acc;
      }, {});

    const orderResVos = [];
    for (const orderId in groupedOrderDetails) {
      const details = groupedOrderDetails[orderId];
      const itemIds = details.map((v) => v.itemId);
      const items = await this.itemRepository.find({
        where: { id: In(itemIds) },
      });

      const orderVo = orders.find((v) => v.id === orderId);
      const user = await this.userRepository.findOne({
        where: { id: orderVo.userCId },
      });

      const orderDetailVos = [];

      for (const v of details) {
        const item = items.find((item) => item.id === v.itemId);
        orderDetailVos.push(this.#orderDetailToVo(v, item));
      }

      orderResVos.push(
        new OrderResVo({
          id: orderVo.id,
          detail: orderDetailVos,
          totalValue: orderVo.totalValue,
          totalCount: orderVo.totalCount,
          memo: orderVo.memo,
          userId: user.id,
          userName: user.userName,
          businessId: orderVo.businessId,
          tableNo: orderVo.tableNo,
          status: orderVo.status,
        }),
      );
    }
    return orderResVos;
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
      businessId: order.businessId,
      tableNo: order.tableNo,
      status: order.status,
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
          businessId: order.businessId,
          tableNo: order.tableNo,
          status: order.status,
        }),
      );
    }

    return orderResVos;
  }

  async getByBusinessId(businessId: string): Promise<OrderResVo[]> {
    const orders = await this.orderRepository.find({
      where: { businessId },
      order: { createdAt: 'DESC' },
    });

    if (orders?.length == 0) {
      return [];
    }

    const orderResVos = [];

    for (const order of orders) {
      const user = await this.userRepository.findOne({
        where: { id: order.userCId },
      });
      if (!user) {
        throw new Error(`User with id ${order.userCId} not found`);
      }

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
          businessId: order.businessId,
          tableNo: order.tableNo,
          status: order.status,
        }),
      );
    }

    return orderResVos;
  }

  async updateStatus(orderId: string, status: number): Promise<boolean> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }

    order.status = status;
    const result = await this.orderRepository.save(order);
    return !!result;
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

  #orderDetailToVo(orderDetail: OrderDetail, item): OrderDetailVo {
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
      modifications: orderDetail.modification,
      memo: orderDetail.memo,
    });
  }

  notifyTest(businessId: string, orderId: string): void {
    this.orderNotifyGateway.handleOrderCreated({
      businessId: businessId,
      OrderId: orderId,
    });
  }

  test(): void {
    this.orderNotifyGateway.test(
      '7709e3c4-57bc-11ee-8c99-0242ac120002',
      '7d3f1a09-8068-4400-83d7-1b3631d78f5d',
      Math.floor(Date.now() / 1000),
    );
  }
}
