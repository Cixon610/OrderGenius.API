import { Menu } from 'src/infra/typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuAddReqVo, MenuDto } from 'src/core/models';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  add(menuDto: MenuAddReqVo) {
    //TODO:抽Adapter層
    const newMenu = this.menuRepository.create(
      new MenuDto({
        businessId: menuDto.businessId,
        name: menuDto.name,
        description: menuDto.description,
      }),
    );
    return this.menuRepository.save(newMenu);
  }

  get(id: string) {
    return this.menuRepository.findOne({ where: { id } });
  }
}
