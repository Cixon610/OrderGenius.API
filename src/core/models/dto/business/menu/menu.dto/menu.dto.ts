import { randomUUID } from 'crypto';
export class MenuDto {
  public constructor(init?: Partial<MenuDto>) {
    Object.assign(this, init);
  }

  id: string = randomUUID();
  businessId: string;
  name: string;
  description: string | null;
  pictureUrl: string | null;
  active: boolean;
  updateUserId: string | null;
  categoryIds: string[];
}
