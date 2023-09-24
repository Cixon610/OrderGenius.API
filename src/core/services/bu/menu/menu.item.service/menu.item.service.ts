import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MenuItem } from 'src/infra/typeorm';
import {
  MenuItemDto,
  MenuItemUpdateReqVo,
  MenuItemAddReqVo,
  MenuItemResVo,
} from 'src/core/models';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
  ) {}

  async add(vo: MenuItemAddReqVo): Promise<MenuItemResVo> {
    //TODO:抽Adapter層
    const newMenuItem = this.menuItemRepository.create(
      new MenuItemDto({
        businessId: vo.businessId,
        name: vo.name,
        description: vo.description,
        price: vo.price,
        modification: vo.modification,
        note: vo.note,
        enable: vo.enable,
        promoted: vo.enable,
        pictureUrl: vo.pictureUrl,
      }),
    );
    return this.toVo(await this.menuItemRepository.save(newMenuItem));
  }

  async update(vo: MenuItemUpdateReqVo): Promise<MenuItemResVo> {
    const menuToUpdate = await this.menuItemRepository.findOne({
      where: { id: vo.id },
    });
    if (!menuToUpdate) {
      throw new Error(`Menu with id ${vo.id} not found`);
    }
    const updatedMenu = Object.assign(menuToUpdate, vo);
    return this.toVo(await this.menuItemRepository.save(updatedMenu));
  }

  async delete(id: string): Promise<boolean> {
    const menuToDelete = await this.menuItemRepository.findOne({
      where: { id },
    });
    if (!menuToDelete) {
      throw new Error(`MenuItem with id ${id} not found`);
    }
    return !!this.menuItemRepository.delete(id);
  }

  async get(id: string): Promise<MenuItemResVo> {
    return this.toVo(await this.menuItemRepository.findOne({ where: { id } }));
  }

  async getByKey(key: string): Promise<MenuItemResVo[]> {
    var vos = await this.menuItemRepository.find({
      where: { name: Like(`%${key}%`) },
    });
    return vos.map((vo) => this.toVo(vo));
  }

  async getByBusinessId(businessId: string): Promise<MenuItemResVo[]> {
    var vos = await this.menuItemRepository.find({ where: { businessId } });
    return vos.map((vo) => this.toVo(vo));
  }

  private toVo(menuItem: MenuItem): MenuItemResVo {
    if (!menuItem) {
      return null;
    }
    return new MenuItemResVo({
      id: menuItem.id,
      businessId: menuItem.businessId,
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      modification: menuItem.modification,
      note: menuItem.note,
      enable: menuItem.enable,
      promoted: menuItem.promoted,
      pictureUrl: menuItem.pictureUrl,
    });
  }
}
