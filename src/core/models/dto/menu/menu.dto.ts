import { randomUUID } from 'crypto';
export class MenuDto {
  public constructor(init?: Partial<MenuDto>) {
    Object.assign(this, init);
  }

  id: string = randomUUID();
  businessId: string;
  name: string;
  description: string;
  creationTime: Date = new Date();
  updateTime: Date = new Date();
  updateUserId: string;
}
