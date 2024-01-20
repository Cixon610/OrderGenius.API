import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import {
  BusinessVo,
  BusinessDto,
  BusinessResVo,
  BusinessUpdateReqVo,
  BusinessUserResVo,
} from 'src/core/models';
import { Business, BusinessUser } from 'src/infra/typeorm';
import { In, Like, Repository } from 'typeorm';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(BusinessUser)
    private readonly businessUserRepository: Repository<BusinessUser>,
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
    const result = await this.businessRepository.save(newbusiness);
    return plainToInstance(BusinessResVo, result);
  }

  async update(vo: BusinessUpdateReqVo): Promise<BusinessResVo> {
    const businessToUpdate = await this.businessRepository.findOne({
      where: { id: vo.id },
    });
    if (!businessToUpdate) {
      throw new Error(`Menu with id ${vo.id} not found`);
    }
    const updatedBusiness = Object.assign(businessToUpdate, vo);
    const result = await this.businessRepository.save(updatedBusiness);
    return plainToInstance(BusinessResVo, result);
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
    const result = await this.businessRepository.findOne({ where: { id } });
    return plainToInstance(BusinessResVo, result);
  }

  async getByKey(key: string): Promise<BusinessResVo[]> {
    var vos = await this.businessRepository.find({
      where: { name: Like(`%${key}%`) },
      order: { updatedAt: 'DESC' },
    });
    return vos.map((vo) => plainToInstance(BusinessResVo, vo));
  }

  async updateBusinessUser(
    businessId: string,
    userIds: string[],
  ): Promise<boolean> {
    const matchedUsers = await this.businessUserRepository.find({
      where: { id: In(userIds) },
    });
    if (matchedUsers.length !== userIds.length) {
      return false;
    }

    matchedUsers.forEach((user) => {
      user.businessId = businessId;
    });

    await this.businessUserRepository.save(matchedUsers);

    return true;
  }
}
