import { join } from 'path';
import { Injectable } from '@nestjs/common';
import {
  PromptCategoryVo,
  PromptItemVo,
  PromptMenuVo,
  PromptModificationVo,
} from 'src/core/models';
import { ModificationService } from '../modification/modification.service';
import { MenuCategoryService } from '../menu.category.service/menu.category.service';
import { MenuService } from '../menu.service/menu.service';
import { MenuItemService } from '../menu.item.service/menu.item.service';
import { stringify } from 'querystring';

@Injectable()
export class MenuPromptService {
  constructor(
    private readonly modificationService: ModificationService,
    private readonly MenuItemService: MenuItemService,
    private readonly menuCategoryService: MenuCategoryService,
    private readonly menuService: MenuService,
  ) {}

  async getActive(businessId: string, businessName: string): Promise<string> {
    const menus = await this.menuService.getByBusinessId(businessId);
    const promptMenus: PromptMenuVo[] = [];
    for (const menu of menus) {
      const categories = await this.menuCategoryService.getByCategoryIds(
        menu.categoryIds,
      );
      const promptCategories: PromptCategoryVo[] = [];
      for (const category of categories) {
        const items = await this.MenuItemService.getByItemIds(
          category.menuItemIds,
        );
        const promptItems: PromptItemVo[] = [];
        for (const item of items) {
          const modifications = await this.modificationService.getByIds(
            item.modificationIds,
          );

          const promptModifications = modifications.map((m) => {
            return new PromptModificationVo({
              name: m.name,
              options: m.options,
              maxChoices: m.maxChoices,
            });
          });
          promptItems.push(
            new PromptItemVo({
              id: item.id,
              name: item.name,
              description: item.description,
              price: item.price,
              note: item.note,
              enable: item.enable,
              promoted: item.promoted,
              modifications: promptModifications,
            }),
          );
        }
        promptCategories.push(
          new PromptCategoryVo({
            name: category.name,
            description: category.description,
            items: promptItems,
          }),
        );
      }

      promptMenus.push(
        new PromptMenuVo({
          name: menu.name,
          description: menu.description,
          categories: promptCategories,
        }),
      );
    }
    const jsonString = JSON.stringify(promptMenus);
    return `# ${businessName}菜單Json如下: ${jsonString}`;
  }

  async getActiveCategory(businessId: string, businessName: string) {
    const activeMenu = (await this.menuService.getByBusinessId(businessId))[0];
    const categories = await this.menuCategoryService.getByCategoryIds(
      activeMenu.categoryIds,
    );
    const categoryNames = categories.map((x) => x.name).join(', ');
    return `# ${businessName} ${activeMenu.name}菜單分類如下: ${categoryNames}`;
  }
}
