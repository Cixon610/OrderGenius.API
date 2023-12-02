import { Menu, MenuMapping, ViewMenuCategory } from 'src/infra/typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MenuVo,
  MenuCategoryResVo,
  MenuDto,
  MenuMappingDto,
  MenuResVo,
  MenuUpdateReqVo,
} from 'src/core/models';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(MenuMapping)
    private readonly menuMappingRepository: Repository<MenuMapping>,
    @InjectRepository(ViewMenuCategory)
    private readonly viewMenuCategoryRepository: Repository<ViewMenuCategory>,
  ) {}

  async add(vo: MenuVo): Promise<MenuResVo> {
    //TODO:抽Adapter層
    const newMenu = await this.menuRepository.save(
      this.menuRepository.create(
        new MenuDto({
          businessId: vo.businessId,
          name: vo.name,
          description: vo.description,
          pictureUrl: vo.pictureUrl,
        }),
      ),
    );

    if (!newMenu) {
      throw new Error(
        'MenuCategoryService.add: Failed to create new MenuCategory',
      );
    }

    await this.addMapping(vo.categoryIds, newMenu.id);
    return this.get(newMenu.id);
  }

  async update(vo: MenuUpdateReqVo): Promise<MenuResVo> {
    const toUpdate = await this.menuRepository.findOne({
      where: { id: vo.id },
    });

    if (!toUpdate) {
      throw new Error(`MenuCategory with id ${vo.id} not found`);
    }

    const updated = await this.menuRepository.save(Object.assign(toUpdate, vo));

    if (!updated) {
      throw new Error(`MenuCategory with id ${vo.id} not updated`);
    }

    if (vo.categoryIds.length === 0) {
      return this.get(vo.id);
    }

    await this.deleteMapping(vo.id);
    await this.addMapping(vo.categoryIds, vo.id);

    return this.get(vo.id);
  }

  async delete(id: string): Promise<boolean> {
    const menuToDelete = await this.menuRepository.findOne({
      where: { id },
    });
    if (!menuToDelete) {
      throw new Error(`Menu with id ${id} not found`);
    }
    const deleted = await this.menuRepository.delete(id);
    deleted && (await this.deleteMapping(id));
    return !!deleted;
  }

  async get(id: string): Promise<MenuResVo> {
    return this.toVo(
      await this.viewMenuCategoryRepository.find({ where: { menuId: id } }),
    );
  }

  async getByBusinessId(businessId: string): Promise<MenuResVo[]> {
    return this.toVos(
      await this.viewMenuCategoryRepository.find({
        where: { businessId },
        order: { menuUpdatedAt: 'DESC', categoryUpdatedAt: 'DESC' },
      }),
    );
  }

  //#region private methods

  private toVo(Item: ViewMenuCategory[]): MenuResVo {
    if (!Item) {
      return null;
    }

    const res = this.toVos(Item);
    return res[0];
  }

  private toVos(Item: ViewMenuCategory[]): MenuResVo[] {
    if (!Item) {
      return null;
    }

    Item.sort((a, b) => {
      return a.categoryUpdatedAt > b.categoryUpdatedAt ? -1 : 1;
    });

    const grouped = Item.reduce((arr, view) => {
      const key = view.menuId;
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
        const vo = new MenuResVo({
          id: element[0].menuId,
          businessId: element[0].businessId,
          name: element[0].menuName,
          description: element[0].menuDescription,
          pictureUrl: element[0].menuPictureUrl,
          menuCategories: element
            .filter((category) => {
              !!category.categoryId;
            })
            .map((category) => {
              return new MenuCategoryResVo({
                id: category.categoryId,
                businessId: category.businessId,
                name: category.categoryName,
                description: category.categoryDescription,
                pictureUrl: category.categoryPictureUrl,
              });
            }),
        });
        res.push(vo);
      }
    }
    return res;
  }

  private async addMapping(
    categoryIds: string[],
    menuId: string,
  ): Promise<void> {
    if (categoryIds.length === 0) {
      return;
    }

    //TODO:Check if menu item exists
    const mapperDtos = categoryIds.map((categoryId) => {
      return new MenuMappingDto({
        menuId: menuId,
        menuCategoryId: categoryId,
      });
    });

    const result = await this.menuMappingRepository.insert(mapperDtos);
  }

  private async deleteMapping(menuId: string): Promise<void> {
    const mappings = await this.menuMappingRepository.find({
      where: { menuId },
    });

    if (mappings.length === 0) {
      return;
    }

    this.menuMappingRepository.delete(mappings.map((mapping) => mapping.id));
  }
  //#endregion
}
