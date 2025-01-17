import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import {
  MenuItem,
  MenuItemMapping,
  ViewItemModification,
} from 'src/infra/typeorm';
import {
  MenuItemDto,
  MenuItemUpdateReqVo,
  MenuItemVo,
  MenuItemResVo,
  MenuItemMappingDto,
} from 'src/core/models';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(MenuItemMapping)
    private readonly menuItemMappingRepository: Repository<MenuItemMapping>,
    @InjectRepository(ViewItemModification)
    private readonly viewItemModification: Repository<ViewItemModification>,
  ) {}

  async add(vo: MenuItemVo): Promise<MenuItemResVo> {
    //TODO:抽Adapter層
    const newItem = await this.menuItemRepository.save(
      this.menuItemRepository.create(
        new MenuItemDto({
          businessId: vo.businessId,
          name: vo.name,
          description: vo.description,
          price: vo.price,
          note: vo.note,
          enable: vo.enable,
          promoted: vo.promoted,
          pictureUrl: vo.pictureUrl,
        }),
      ),
    );

    if (!newItem) {
      throw new Error('MenuItemService.add: Failed to create new MenuItem');
    }

    await this.addMapping(vo.modificationIds, newItem.id);
    return this.get(newItem.id);
  }

  async update(vo: MenuItemUpdateReqVo): Promise<MenuItemResVo> {
    const toUpdate = await this.menuItemRepository.findOne({
      where: { id: vo.id },
    });

    if (!toUpdate) {
      throw new Error(`MenuItem with id ${vo.id} not found`);
    }

    const updated = await this.menuItemRepository.save(
      Object.assign(toUpdate, vo),
    );

    if (!updated) {
      throw new Error(`MenuItem with id ${vo.id} not updated`);
    }

    await this.deleteMapping(vo.id);
    await this.addMapping(vo.modificationIds, vo.id);

    return this.get(vo.id);
  }

  async delete(id: string): Promise<boolean> {
    const menuToDelete = await this.menuItemRepository.findOne({
      where: { id },
    });

    if (!menuToDelete) {
      throw new Error(`MenuItem with id ${id} not found`);
    }

    const deleted = await this.menuItemRepository.delete(id);
    deleted && (await this.deleteMapping(id));
    return !!deleted;
  }

  async get(id: string): Promise<MenuItemResVo> {
    return this.toVo(
      await this.viewItemModification.find({
        where: { menuItemId: id },
        order: { menuItemCreatedAt: 'DESC', modificationUpdatedAt: 'DESC' },
      }),
    );
  }

  async getByKey(businessId: string, key: string): Promise<MenuItemResVo[]> {
    const vos = await this.viewItemModification.find({
      where: { businessId, menuItemName: Like(`%${key}%`) },
      order: { menuItemUpdatedAt: 'DESC' },
    });
    return this.toVos(vos);
  }

  async getByBusinessId(
    businessId: string,
    limit = 0,
  ): Promise<MenuItemResVo[]> {
    const take = limit == 0 ? {} : { take: limit };
    const latestLimitPromotedItem = await this.menuItemRepository.find({
      where: { businessId, enable: true },
      order: { updatedAt: 'DESC' },
      ...take,
    });

    const vos = await this.viewItemModification.find({
      where: {
        businessId,
        menuItemId: In(latestLimitPromotedItem.map((item) => item.id)),
      },
      order: { menuItemUpdatedAt: 'DESC' },
    });

    return this.toVos(vos);
  }

  async getByItemIds(itemIds: string[]): Promise<MenuItemResVo[]> {
    const vos = await this.viewItemModification.find({
      where: { menuItemId: In(itemIds) },
      order: { menuItemUpdatedAt: 'DESC' },
    });
    return this.toVos(vos);
  }

  async getPromotedItems(
    businessId: string,
    limit = 0,
  ): Promise<MenuItemResVo[]> {
    const take = limit == 0 ? {} : { take: limit };
    const latestLimitPromotedItem = await this.menuItemRepository.find({
      where: { businessId, promoted: true, enable: true },
      order: { updatedAt: 'DESC' },
      ...take,
    });
    const vos = await this.viewItemModification.find({
      where: {
        businessId,
        menuItemId: In(latestLimitPromotedItem.map((item) => item.id)),
      },
      order: { menuItemUpdatedAt: 'DESC' },
    });
    return this.toVos(vos);
  }

  async getItemModificationsByKey(
    businessId: string,
    key: string,
  ): Promise<MenuItemResVo[]> {
    const vos = await this.viewItemModification.find({
      where: {
        businessId,
        menuItemName: Like(`%${key}%`),
        menuItemEnable: true,
      },
      order: { menuItemUpdatedAt: 'DESC' },
    });
    return this.toVosWithModifications(vos);
  }

  async getItemModificationsByItemIds(
    businessId: string,
    ids: string[],
  ): Promise<any[]> {
    const vos = await this.viewItemModification.find({
      where: {
        businessId: businessId,
        menuItemId: In(ids),
        menuItemEnable: true,
      },
      order: { menuItemUpdatedAt: 'DESC' },
    });
    return this.toVosWithModifications(vos);
  }

  //#region private methods

  private toVo(Item: ViewItemModification[]): MenuItemResVo {
    if (!Item) {
      return null;
    }

    const res = this.toVos(Item);
    return res[0];
  }

  private toVos(Item: ViewItemModification[]): MenuItemResVo[] {
    if (!Item) {
      return null;
    }

    const grouped = Item.reduce((arr, view) => {
      const key = view.menuItemId;
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
        const vo = new MenuItemResVo({
          id: element[0].menuItemId,
          businessId: element[0].businessId,
          name: element[0].menuItemName,
          description: element[0].menuItemDescription,
          note: element[0].menuItemNotes,
          price: +element[0].menuItemPrice,
          enable: element[0].menuItemEnable,
          promoted: element[0].menuItemPromoted,
          pictureUrl: element[0].menuItemPictureUrl,
          modificationIds: element
            .filter((modification) => !!modification.modificationId)
            .map((modification) => modification.modificationId),
        });
        res.push(vo);
      }
    }
    return res;
  }

  private toVosWithModifications(Item: ViewItemModification[]) {
    if (!Item) {
      return null;
    }

    const grouped = Item.reduce((arr, view) => {
      const key = view.menuItemId;
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
        const vo = {
          id: element[0].menuItemId,
          // businessId: element[0].businessId,
          name: element[0].menuItemName,
          description: element[0].menuItemDescription,
          note: element[0].menuItemNotes,
          price: +element[0].menuItemPrice,
          // enable: element[0].menuItemEnable,
          // promoted: element[0].menuItemPromoted,
          // pictureUrl: element[0].menuItemPictureUrl,
          modifications: element
            .filter((modification) => !!modification.modificationId)
            .map((modification) => {
              return {
                name: modification.modificationName,
                maxChoices: modification.modificationMaxChoices,
                minChoices: modification.modificationMinChoices,
                options: modification.modificationOptions,
              };
            }),
        };
        res.push(vo);
      }
    }
    return res;
  }

  private async addMapping(
    modificationIds: string[],
    menuItemId: string,
  ): Promise<void> {
    if (modificationIds.length === 0) {
      return;
    }

    //TODO:Check if menu item exists
    const mapperDtos = modificationIds.map((modificationId) => {
      return new MenuItemMappingDto({
        menuItemId: menuItemId,
        modificationId: modificationId,
      });
    });

    const result = await this.menuItemMappingRepository.insert(mapperDtos);
  }

  private async deleteMapping(menuItemId: string): Promise<void> {
    const mappings = await this.menuItemMappingRepository.find({
      where: { menuItemId },
    });

    if (mappings.length === 0) {
      return;
    }

    this.menuItemMappingRepository.delete(
      mappings.map((mapping) => mapping.id),
    );
  }
  //#endregion
}
