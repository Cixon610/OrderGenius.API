import { randomUUID } from 'crypto';
export class OrderDetailDto {
  public constructor(init?: Partial<OrderDetailDto>) {
    Object.assign(this, init);
  }

  id: string = randomUUID();
  orderId: string;
  itemId: string;
  itemPrice: number;
  totalPrice: number | null;
  modification: object | null;
  count: number | null;
  memo: string | null;
}
