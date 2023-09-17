import { Menu } from 'src/infra/typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuAddReqVo, MenuDto } from 'src/core/models';
import { MenuUpdateReqVo } from 'src/core/models/vo/req/menu.update.req.vo';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async add(vo: MenuAddReqVo) : Promise<Menu> {
    //TODO:抽Adapter層
    const newMenu = this.menuRepository.create(
      new MenuDto({
        businessId: vo.businessId,
        name: vo.name,
        description: vo.description,
      }),
    );
    return this.menuRepository.save(newMenu);
  }

  async update(vo: MenuUpdateReqVo) : Promise<Menu> {
    const menuToUpdate = await this.menuRepository.findOne({
      where: { id: vo.id },
    });
    if (!menuToUpdate) {
      throw new Error(`Menu with id ${vo.id} not found`);
    }
    const updatedMenu = Object.assign(menuToUpdate, vo);
    return this.menuRepository.save(updatedMenu);
  }

  async delete(id: string) : Promise<boolean> {
    const menuToDelete = await this.menuRepository.findOne({
      where: { id },
    });
    if (!menuToDelete) {
      throw new Error(`Menu with id ${id} not found`);
    }
    return !!this.menuRepository.delete(id);
  }

  async get(id: string) : Promise<Menu> {
    return this.menuRepository.findOne({ where: { id } });
  }

  async getByBusinessId(businessId: string) : Promise<Menu[]> {
    return this.menuRepository.find({ where: { businessId } });
  }
}
