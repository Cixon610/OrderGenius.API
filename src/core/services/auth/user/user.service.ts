import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessUserDto, UserCreateReqVo, UserResVo } from 'src/core/models';
import { BusinessUser } from 'src/infra/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(BusinessUser)
    private readonly businessUserRepository: Repository<BusinessUser>,
  ) {}

  async create2bUser(vo: UserCreateReqVo): Promise<UserResVo> {
    const newUser = this.businessUserRepository.create(
      new BusinessUserDto({
        businessId: vo.businessId,
        userName: vo.userName,
        account: vo.account,
        password: vo.password,
        email: vo.email,
        phone: vo.phone,
        address: vo.address,
      }),
    );
    return this.toVo(await this.businessUserRepository.save(newUser));
  }

  async isUserExist(account: string): Promise<boolean> {
    const user = await this.businessUserRepository.findOne({
      where: { account },
    });
    return user ? true : false;
  }

  private toVo(vo: BusinessUser): UserResVo {
    if (!vo) {
      return null;
    }
    return new UserResVo({
      id: vo.id,
      businessId: vo.businessId,
      userName: vo.userName,
      account: vo.account,
      password: vo.password,
      email: vo.email,
      phone: vo.phone,
      address: vo.address,
    });
  }
}
