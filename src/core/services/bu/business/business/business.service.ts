import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessVo,
  BusinessDto,
  BusinessResVo,
  BusinessUpdateReqVo,
} from 'src/core/models';
import { Business } from 'src/infra/typeorm';
import { Like, Repository } from 'typeorm';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async add(vo: BusinessVo): Promise<BusinessResVo> {
    const newbusiness = this.businessRepository.create(
      new BusinessDto({
        name: vo.name,
        placeId: vo.placeId,
        address: vo.address,
        phone: vo.phone,
      }),
    );
    return this.toVo(await this.businessRepository.save(newbusiness));
  }

  async update(vo: BusinessUpdateReqVo): Promise<BusinessResVo> {
    const businessToUpdate = await this.businessRepository.findOne({
      where: { id: vo.id },
    });
    if (!businessToUpdate) {
      throw new Error(`Menu with id ${vo.id} not found`);
    }
    const updatedBusiness = Object.assign(businessToUpdate, vo);
    return this.toVo(await this.businessRepository.save(updatedBusiness));
  }

  async delete(id: string): Promise<boolean> {
    const businessToDelete = await this.businessRepository.findOne({
      where: { id },
    });
    if (!businessToDelete) {
      throw new Error(`Business with id ${id} not found`);
    }
    return !!this.businessRepository.delete(id);
  }

  async get(id: string): Promise<BusinessResVo> {
    return this.toVo(await this.businessRepository.findOne({ where: { id } }));
  }

  async getByKey(key: string): Promise<BusinessResVo[]> {
    var vos = await this.businessRepository.find({
      where: { name: Like(`%${key}%`) },
    });
    return vos.map((vo) => this.toVo(vo));
  }

  private toVo(business: Business): BusinessResVo {
    if (!business) {
      return null;
    }
    return new BusinessResVo({
      id: business.id,
      name: business.name,
      placeId: business.placeId,
      address: business.address,
      phone: business.phone,
    });
  }
}
