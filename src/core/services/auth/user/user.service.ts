import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessUserDto, UserCreateReqVo, UserResVo } from 'src/core/models';
import { BusinessUser } from 'src/infra/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SysConfigService } from 'src/infra/services';
import { Role } from 'src/core/constants/enums/role.enum';

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

  async find(account: string){
    return await this.businessUserRepository.findOne({
      where: { account },
    });
  }

  async validate(account: string, password: string) {
    let role = Role.COSTUMER;
    //TODO: add cuser validate
    const cuser = null;

    const buser = await this.businessUserRepository.findOne({
      where: { account },
    });

    if (!!buser) {
      const isPasswordValid = await bcrypt.compare(password, buser.password);
      if (!isPasswordValid) {
        return null;
      }
      if( buser.userName == 'admin'){
        role = Role.ADMIN;
      }
      
      return { user: buser, role: role };
    }
    return null;
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
