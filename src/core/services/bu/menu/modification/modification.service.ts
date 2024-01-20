import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import {
  ModificationDto,
  ModificationResVo,
  ModificationUpdateReqVo,
  ModificationVo,
} from 'src/core/models';
import { Modification } from 'src/infra/typeorm';
import { Like, Repository } from 'typeorm';

@Injectable()
export class ModificationService {
  constructor(
    @InjectRepository(Modification)
    private readonly modificationRepository: Repository<Modification>,
  ) {}

  async add(vo: ModificationVo): Promise<ModificationResVo> {
    //TODO:抽Adapter層
    const newItem = await this.modificationRepository.save(
      this.modificationRepository.create(
        new ModificationDto({
          businessId: vo.businessId,
          name: vo.name,
          options: vo.options,
          maxChoices: vo.maxChoices,
        }),
      ),
    );

    return plainToInstance(ModificationResVo, newItem);
  }

  async update(vo: ModificationUpdateReqVo): Promise<ModificationResVo> {
    const toUpdate = await this.modificationRepository.findOne({
      where: { id: vo.id },
    });
    if (!toUpdate) {
      throw new Error(`Menu with id ${vo.id} not found`);
    }
    const updatedBusiness = Object.assign(toUpdate, vo);
    const result = await this.modificationRepository.save(updatedBusiness);
    return plainToInstance(ModificationResVo, result);
  }

  async delete(id: string): Promise<boolean> {
    const menuToDelete = await this.modificationRepository.findOne({
      where: { id },
    });

    if (!menuToDelete) {
      throw new Error(`MenuItem with id ${id} not found`);
    }

    const deleted = await this.modificationRepository.delete(id);
    return !!deleted;
  }

  async get(id: string): Promise<ModificationResVo> {
    const vo = await this.modificationRepository.findOne({ where: { id } });
    return plainToInstance(ModificationResVo, vo);
  }

  async getByKey(key: string): Promise<ModificationResVo[]> {
    const vos = await this.modificationRepository.find({
      where: { name: Like(`%${key}%`) },
      order: { updatedAt: 'DESC' },
    });
    return vos.map((vo) => plainToInstance(ModificationResVo, vo));
  }

  async getByBusinessId(businessId: string): Promise<ModificationResVo[]> {
    var vos = await this.modificationRepository.find({
      where: { businessId },
      order: { updatedAt: 'DESC' },
    });
    return vos.map((vo) => plainToInstance(ModificationResVo, vo));
  }
}
