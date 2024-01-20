import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessUserDto,
  BusinessUserUpdateReqVo,
  BusinessUserVo,
  BusinessUserResVo,
} from 'src/core/models';
import { BusinessUser } from 'src/infra/typeorm';
import { In, Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SysConfigService } from 'src/infra/services';
import { Role } from 'src/core/constants/enums/role.enum';
import { plainToInstance } from 'class-transformer';

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
    const result = await this.businessUserRepository.save(newUser);
    return plainToInstance(BusinessUserResVo, result);
  }

  async isUserExist(account: string): Promise<boolean> {
    const user = await this.businessUserRepository.findOne({
      where: { account },
    });
    return user ? true : false;
  }

  async validate(account: string, password: string) {
    let role = Role.COSTUMER;

    const buser = await this.businessUserRepository.findOne({
      where: { account },
    });

    if (!buser) {
      throw new BadRequestException('User not found');
    }
    role = Role.BUSINESS;
    const isPasswordValid = await bcrypt.compare(password, buser.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Password not valid');
    }

    if (buser.userName == 'admin') {
      role = Role.ADMIN;
    }

    return { user: buser, role: role };
  }

  async update(vo: BusinessUserUpdateReqVo): Promise<BusinessUserResVo> {
    const toUpdate = await this.businessUserRepository.findOne({
      where: { id: vo.id },
    });
    if (!toUpdate) {
      throw new Error(`BusinessUser with id ${vo.id} not found`);
    }
    const updated = Object.assign(toUpdate, vo);
    const result = await this.businessUserRepository.save(updated);
    return plainToInstance(BusinessUserResVo, result);
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
    const result = await this.businessUserRepository.findOne({ where: { id } });
    return plainToInstance(BusinessUserResVo, result);
  }

  async getByIds(ids: string[]): Promise<BusinessUserResVo[]> {
    const result = await this.businessUserRepository.find({ where: { id: In(ids) } });
    return result.map((vo) => plainToInstance(BusinessUserResVo, vo));
  }

  async getByKey(key: string): Promise<BusinessUserResVo[]> {
    var vos = await this.businessUserRepository.find({
      where: { userName: Like(`%${key}%`) },
      order: { updatedAt: 'DESC' },
    });
    return vos.map((vo) => plainToInstance(BusinessUserResVo, vo));
  }

  async getByAccount(account: string) {
    const result = await this.businessUserRepository.findOne({
      where: { account },
    });
    return plainToInstance(BusinessUserResVo, result);
  }

  async getByBusinessId(businessId: string): Promise<BusinessUserResVo[]> {
    var vos = await this.businessUserRepository.find({
      where: { businessId },
      order: { updatedAt: 'DESC' },
    });
    return vos.map((vo) => plainToInstance(BusinessUserResVo, vo));
  }
}
