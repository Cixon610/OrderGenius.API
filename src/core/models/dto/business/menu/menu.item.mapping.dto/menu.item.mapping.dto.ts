import { randomUUID } from 'crypto';

export class MenuItemMappingDto {
  public constructor(init?: Partial<MenuItemMappingDto>) {
    Object.assign(this, init);
  }

  id: string = randomUUID();
  menuItemId: string;
  modificationId: string;
  updateUserId: string | null;
}
