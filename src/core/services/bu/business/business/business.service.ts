import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import {
  BusinessVo,
  BusinessDto,
  BusinessResVo,
  BusinessUpdateReqVo,
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
    if(vo.userIds && vo.userIds.length > 0){
      const users = await this.businessUserRepository.find({ where: { id: In(vo.userIds) } });
      users.forEach((user) => {
        //TODO: 之後支援多商家時，要改成加入商家mapping表
        user.businessId = result.id;
      });
      await this.businessUserRepository.save(users);
    }
    return this.get(result.id);
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
    return this.get(result.id);
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
    const business = await this.businessRepository.findOne({ where: { id } });
    if (!business) {
      throw new Error(`Business with id ${id} not found`);
    }

    const businessUsers = await this.businessUserRepository.find({
      where: { businessId: id },
    });

    var result = plainToInstance(BusinessResVo, business);
    result.userIds = businessUsers.map((user) => user.id);
    return result;
  }

  async getByKey(key: string): Promise<BusinessResVo[]> {
    const vos = await this.businessRepository.find({
      where: { name: Like(`%${key}%`) },
      order: { updatedAt: 'DESC' },
    });
    let result = [];
    for(const vo of vos){
      const businessResVo = plainToInstance(BusinessResVo, vo);
      const businessUsers = await this.businessUserRepository.find({
        where: { businessId: vo.id },
      });
      businessResVo.userIds = businessUsers.map((user) => user.id);
      result.push(businessResVo);
    }
    return result;
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
