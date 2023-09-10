import { Menu } from 'src/infra/typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuDto } from 'src/core/models';
import * as crypto from 'crypto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  add(menuDto: MenuDto) {
    menuDto.id = crypto.randomUUID();
    menuDto.businessId = crypto.randomUUID();
    menuDto.updateUserId = crypto.randomUUID();
    menuDto.creationTime = new Date();
    menuDto.updateTime = new Date();
    const newLineAccount = this.menuRepository.create(menuDto);
    return this.menuRepository.save(newLineAccount);
  }

  get(id: string) {
    return this.menuRepository.findOne({ where: { id } });
  }
}
