import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuCategory, MenuMapping } from 'src/infra/typeorm';
import {
  MenuCategoryDto,
  MenuCategoryMappingDto,
  MenuCategoryReqVo,
  MenuCategoryResVo,
} from 'src/core/models';

@Injectable()
export class MenuCategoryService {
  constructor(
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
    @InjectRepository(MenuMapping)
    private readonly menuMappingRepository: Repository<MenuMapping>,
  ) {}

  async add(vo: MenuCategoryReqVo): Promise<MenuCategoryResVo> {
    //TODO:抽Adapter層
    const newItem = this.menuMappingRepository.create(
      new MenuCategoryDto({
        businessId: vo.businessId,
        name: vo.name,
        description: vo.description,
        pictureUrl: vo.pictureUrl,
      }),
    );

    if (!newItem) {
      throw new Error(
        'MenuCategoryService.add: Failed to create new MenuCategory',
      );
    }

    if (vo.menuItemIds.length !== 0) {
      //TODO:Check if menu item exists
      const mapperDtos = vo.menuItemIds.map((id) => {
        return new MenuCategoryMappingDto({
          menuCategoryId: newItem.id,
          menuItemId: id,
        });
      });

      this.menuMappingRepository.insert(mapperDtos);
    }

    return this.toVo(await this.menuCategoryRepository.save(newItem));
  }

  private toVo(Item: MenuCategory): MenuCategoryResVo {
    if (!Item) {
      return null;
    }
    return new MenuCategoryResVo({
      id: Item.id,
      businessId: Item.businessId,
      name: Item.name,
      description: Item.description,
      pictureUrl: Item.pictureUrl,
    });
  }
}
