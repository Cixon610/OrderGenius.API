import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import {
  MenuCategory,
  MenuCategoryMapping,
  ViewCategoryItem,
} from 'src/infra/typeorm';
import {
  MenuCategoryDto,
  MenuCategoryMappingDto,
  MenuCategoryVo,
  MenuCategoryResVo,
  MenuCategoryUpdateReqVo,
  MenuItemResVo,
} from 'src/core/models';

@Injectable()
export class MenuCategoryService {
  constructor(
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
    @InjectRepository(MenuCategoryMapping)
    private readonly menuCategoryMappingRepository: Repository<MenuCategoryMapping>,
    @InjectRepository(ViewCategoryItem)
    private readonly viewCategoryItemRepository: Repository<ViewCategoryItem>,
  ) {}

  async add(vo: MenuCategoryVo): Promise<MenuCategoryResVo> {
    //TODO:抽Adapter層
    const newItem = await this.menuCategoryRepository.save(
      this.menuCategoryRepository.create(
        new MenuCategoryDto({
          businessId: vo.businessId,
          name: vo.name,
          description: vo.description,
          pictureUrl: vo.pictureUrl,
        }),
      ),
    );

    if (!newItem) {
      throw new Error(
        'MenuCategoryService.add: Failed to create new MenuCategory',
      );
    }

    await this.addMapping(vo.menuItemIds, newItem.id);
    return this.get(newItem.id);
  }

  async update(vo: MenuCategoryUpdateReqVo): Promise<MenuCategoryResVo> {
    const toUpdate = await this.menuCategoryRepository.findOne({
      where: { id: vo.id },
    });

    if (!toUpdate) {
      throw new Error(`MenuCategory with id ${vo.id} not found`);
    }

    const updated = await this.menuCategoryRepository.save(
      Object.assign(toUpdate, vo),
    );

    if (!updated) {
      throw new Error(`MenuCategory with id ${vo.id} not updated`);
    }

    if (vo.menuItemIds.length === 0) {
      return this.get(vo.id);
    }

    await this.deleteMapping(vo.id);
    await this.addMapping(vo.menuItemIds, vo.id);

    return this.get(vo.id);
  }

  async delete(id: string): Promise<boolean> {
    const menuToDelete = await this.menuCategoryRepository.findOne({
      where: { id },
    });

    if (!menuToDelete) {
      throw new Error(`MenuItem with id ${id} not found`);
    }

    const deleted = await this.menuCategoryRepository.delete(id);
    deleted && (await this.deleteMapping(id));
    return !!deleted;
  }

  async get(id: string): Promise<MenuCategoryResVo> {
    return this.toVo(
      await this.viewCategoryItemRepository.find({
        where: { categoryId: id },
        order: { categoryCreatedAt: 'DESC', itemUpdatedAt: 'DESC' },
      }),
    );
  }

  async getByKey(key: string): Promise<MenuCategoryResVo[]> {
    var vos = await this.viewCategoryItemRepository.find({
      where: { categoryName: Like(`%${key}%`) },
      order: { categoryCreatedAt: 'DESC', itemUpdatedAt: 'DESC' },
    });
    return this.toVos(vos);
  }

  async getByBusinessId(businessId: string): Promise<MenuCategoryResVo[]> {
    var vos = await this.viewCategoryItemRepository.find({
      where: { businessId },
      order: { categoryCreatedAt: 'DESC', itemUpdatedAt: 'DESC' },
    });
    return this.toVos(vos);
  }

  //#region private

  private toVo(Item: ViewCategoryItem[]): MenuCategoryResVo {
    if (!Item) {
      return null;
    }

    const res = this.toVos(Item);
    return res[0];
  }

  private toVos(Item: ViewCategoryItem[]): MenuCategoryResVo[] {
    if (!Item) {
      return null;
    }

    const grouped = Item.reduce((arr, view) => {
      const key = view.categoryId;
      if (!arr[key]) {
        arr[key] = [];
      }
      arr[key].push(view);
      return arr;
    }, {});

    const res = [];
    for (const key in grouped) {
      if (Object.prototype.hasOwnProperty.call(grouped, key)) {
        const element = grouped[key];
        const vo = new MenuCategoryResVo({
          id: element[0].categoryId,
          businessId: element[0].businessId,
          name: element[0].categoryName,
          description: element[0].categoryDescription,
          pictureUrl: element[0].categoryPictureUrl,
          menuItems: element
            .filter((item) => {
              !!item.itemId;
            })
            .map((item) => {
              return new MenuItemResVo({
                id: item.itemId,
                name: item.itemName,
                description: item.itemDescription,
                price: item.itemPrice,
                modification: item.itemModification,
                note: item.itemNote,
                enable: item.itemEnable,
                promoted: item.itemPromoted,
                pictureUrl: item.itemPictureUrl,
              });
            }),
        });
        res.push(vo);
      }
    }
    return res;
  }

  private async addMapping(
    itemIds: string[],
    menuCategoryId: string,
  ): Promise<void> {
    if (itemIds.length === 0) {
      return;
    }

    //TODO:Check if menu item exists
    const mapperDtos = itemIds.map((id) => {
      return new MenuCategoryMappingDto({
        menuCategoryId: menuCategoryId,
        menuItemId: id,
      });
    });

    this.menuCategoryMappingRepository.insert(mapperDtos);
  }

  private async deleteMapping(menuCategoryId: string): Promise<void> {
    const mappings = await this.menuCategoryMappingRepository.find({
      where: { menuCategoryId },
    });

    if (mappings.length === 0) {
      return;
    }

    this.menuCategoryMappingRepository.delete(
      mappings.map((mapping) => mapping.id),
    );
  }

  //#endregion
}
