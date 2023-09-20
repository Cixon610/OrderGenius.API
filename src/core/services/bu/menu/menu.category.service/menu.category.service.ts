import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuCategoryReqVo } from 'src/core/models';
import { MenuCategory, MenuMapping } from 'src/infra/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MenuCategoryService {
  constructor(
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
    @InjectRepository(MenuMapping)
    private readonly menuMappingRepository: Repository<MenuMapping>,
  ) {}
  
  async add(vo: MenuCategoryReqVo): Promise<MenuItemResVo> {
    //TODO:抽Adapter層
    const newMenuItem = this.menuMappingRepository.create(
      new MenuItemDto({
        businessId: vo.businessId,
        name: vo.name,
        description: vo.description,
        price: vo.price,
        modification: vo.modification,
        note: vo.note,
        enable: vo.enable,
        pictureUrl: vo.pictureUrl,
      }),
    );
    return this.toVo(await this.menuItemRepository.save(newMenuItem));
  }
}
