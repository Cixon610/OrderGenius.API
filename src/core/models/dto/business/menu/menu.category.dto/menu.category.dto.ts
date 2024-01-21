import { randomUUID } from 'crypto';

export class MenuCategoryDto {
  public constructor(init?: Partial<MenuCategoryDto>) {
    Object.assign(this, init);
  }

  id: string = randomUUID();
  businessId: string;
  name: string;
  description: string | null;
  pictureUrl: string | null;
}
