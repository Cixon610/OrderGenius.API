import { randomUUID } from 'crypto';
export class OrderDto {
  public constructor(init?: Partial<OrderDto>) {
    Object.assign(this, init);
  }

  id: string = randomUUID();
  userCId: string | null;
  messageId: string | null;
  totalValue: number;
  totalCount: number;
  memo: string | null;
  businessId: string | null;
}
