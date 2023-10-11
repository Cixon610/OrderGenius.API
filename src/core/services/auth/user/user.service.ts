import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessUserDto, UserCreateReqVo, UserResVo } from 'src/core/models';
import { BusinessUser } from 'src/infra/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SysConfigService } from 'src/infra/services';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(BusinessUser)
    private readonly businessUserRepository: Repository<BusinessUser>,
    private readonly sysConfigService: SysConfigService,
  ) {}

  async create2bUser(vo: UserCreateReqVo): Promise<UserResVo> {
    const passwordHash = await bcrypt.hash(
      vo.password,
      this.sysConfigService.infra.saltRounds,
    );
    const newUser = this.businessUserRepository.create(
      new BusinessUserDto({
        businessId: vo.businessId,
        userName: vo.userName,
        account: vo.account,
        password: passwordHash,
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

  async validate(username: string, password: string) {
    const user = await this.businessUserRepository.findOne({
      where: { account: username },
    });
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    return user;
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
      email: vo.email,
      phone: vo.phone,
      address: vo.address,
    });
  }
}
