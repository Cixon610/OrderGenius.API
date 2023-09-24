import { randomUUID } from "crypto";

export class MenuMappingDto {
  public constructor(init?: Partial<MenuMappingDto>) {
    Object.assign(this, init);
  }

  id: string = randomUUID();
  menuId: string;
  menuCategoryId: string;
  updateUserId: string | null;
}
