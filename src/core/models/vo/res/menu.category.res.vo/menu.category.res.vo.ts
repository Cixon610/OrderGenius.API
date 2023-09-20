import { MenuItemResVo } from "src/core/models";

export class MenuCategoryResVo {
    public constructor(init?: Partial<MenuCategoryResVo>) {
      Object.assign(this, init);
    }

  id: string;
  businessId: string;
  name: string;
  description: string | null;
  pictureUrl: string | null;
  menuItems: MenuItemResVo[];
}
