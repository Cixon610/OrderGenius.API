import { randomUUID } from "crypto";

export class MenuCategoryMappingDto {
  public constructor(init?: Partial<MenuCategoryMappingDto>) {
    Object.assign(this, init);
  }

  id: string = randomUUID();
  menuCategoryId: string;
  menuItemId: string;
  updateUserId: string | null;
}
