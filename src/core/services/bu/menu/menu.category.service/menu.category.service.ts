import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MenuCategory, MenuCategoryMapping } from 'src/infra/typeorm';
import {
  MenuCategoryDto,
  MenuCategoryMappingDto,
  MenuCategoryAddReqVo,
  MenuCategoryResVo,
  MenuCategoryUpdateReqVo,
} from 'src/core/models';

@Injectable()
export class MenuCategoryService {
  constructor(
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
    @InjectRepository(MenuCategoryMapping)
    private readonly menuCategoryMappingRepository: Repository<MenuCategoryMapping>,
  ) {}

  async add(vo: MenuCategoryAddReqVo): Promise<MenuCategoryResVo> {
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
    return this.toVo(newItem);
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
      return this.toVo(updated);
    }

    await this.deleteMapping(vo.id);
    await this.addMapping(vo.menuItemIds, vo.id);

    return this.toVo(updated);
  }

  async delete(id: string): Promise<boolean> {
    const menuToDelete = await this.menuCategoryRepository.findOne({
      where: { id },
    });

    if (!menuToDelete) {
      throw new Error(`MenuItem with id ${id} not found`);
    }

    const deleted = await this.menuCategoryRepository.delete(id);
    await this.deleteMapping(id);
    return !!deleted;
  }

  async get(id: string): Promise<MenuCategoryResVo> {
    return this.toVo(
      await this.menuCategoryRepository.findOne({ where: { id } }),
    );
  }

  //Todo: 測試，所有get都要取其下的item回傳
  async getWithMapping(id: string): Promise<MenuCategoryResVo> {
    const queryBuilder = this.menuCategoryRepository.createQueryBuilder('category');
    queryBuilder.leftJoinAndSelect('category.mappings', 'mapping')
      .leftJoinAndSelect('mapping.menuItem', 'menuItem')
      .where('category.id = :id', { id });

    const category = await queryBuilder.getOne();
    return this.toVo(category);
  }

  async getByKey(key: string): Promise<MenuCategoryResVo[]> {
    var vos = await this.menuCategoryRepository.find({
      where: { name: Like(`%${key}%`) },
    });
    return vos.map((vo) => this.toVo(vo));
  }

  async getByBusinessId(businessId: string): Promise<MenuCategoryResVo[]> {
    var vos = await this.menuCategoryRepository.find({ where: { businessId } });
    return vos.map((vo) => this.toVo(vo));
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

  private async addMapping(itemIds: string[], menuCategoryId: string): Promise<void> {
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
      mappings.map((mapping) => mapping.id)
    );
  }
}
