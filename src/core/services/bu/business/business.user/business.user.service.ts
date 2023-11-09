import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessUserDto,
  BusinessUserUpdateReqVo,
  BusinessUserVo,
  BusinessUserResVo,
} from 'src/core/models';
import { BusinessUser } from 'src/infra/typeorm';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SysConfigService } from 'src/infra/services';
import { Role } from 'src/core/constants/enums/role.enum';

@Injectable()
export class BusinessUserService {
  constructor(
    @InjectRepository(BusinessUser)
    private readonly businessUserRepository: Repository<BusinessUser>,
    private readonly sysConfigService: SysConfigService,
  ) {}

  async add(vo: BusinessUserVo): Promise<BusinessUserResVo> {
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
      if (buser.userName == 'admin') {
        role = Role.ADMIN;
      }

      return { user: buser, role: role };
    }
    return null;
  }

  async update(vo: BusinessUserUpdateReqVo): Promise<BusinessUserResVo> {
    const toUpdate = await this.businessUserRepository.findOne({
      where: { id: vo.id },
    });
    if (!toUpdate) {
      throw new Error(`BusinessUser with id ${vo.id} not found`);
    }
    const updated = Object.assign(toUpdate, vo);
    return this.toVo(await this.businessUserRepository.save(updated));
  }

  async delete(id: string): Promise<boolean> {
    const tooDelete = await this.businessUserRepository.findOne({
      where: { id },
    });
    if (!tooDelete) {
      throw new Error(`BusinessUser with id ${id} not found`);
    }
    return !!this.businessUserRepository.delete(id);
  }

  async get(id: string): Promise<BusinessUserResVo> {
    return this.toVo(
      await this.businessUserRepository.findOne({ where: { id } }),
    );
  }

  async getByKey(key: string): Promise<BusinessUserResVo[]> {
    var vos = await this.businessUserRepository.find({
      where: { userName: Like(`%${key}%`) },
    });
    return vos.map((vo) => this.toVo(vo));
  }

  async getByAccount(account: string) {
    return await this.businessUserRepository.findOne({
      where: { account },
    });
  }

  async getByBusinessId(businessId: string): Promise<BusinessUserResVo[]> {
    var vos = await this.businessUserRepository.find({ where: { businessId } });
    return vos.map((vo) => this.toVo(vo));
  }

  private toVo(vo: BusinessUser): BusinessUserResVo {
    if (!vo) {
      return null;
    }
    return new BusinessUserResVo({
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
