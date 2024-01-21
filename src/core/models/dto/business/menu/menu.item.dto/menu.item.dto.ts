import { randomUUID } from 'crypto';

export class MenuItemDto {
  public constructor(init?: Partial<MenuItemDto>) {
    Object.assign(this, init);
  }
  
  id: string = randomUUID();
  businessId: string;
  name: string;
  description: string | null;
  price: number = 0;
  modification: object | null;
  note: string | null;
  enable: boolean;
  promoted: boolean;
  pictureUrl: string | null;
}
