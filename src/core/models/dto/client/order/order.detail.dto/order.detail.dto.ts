import { randomUUID } from 'crypto';
export class OrderDetailDto {
  public constructor(init?: Partial<OrderDetailDto>) {
    Object.assign(this, init);
  }

  id: string = randomUUID();
  orderId: string;
  itemId: string;
  itemPrice: Number;
  totalPrice: Number | null;
  modification: object | null;
  memo: string | null;
}
