import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ClientUserDto,
  ClientUserResVo,
  ClientUserUpdateReqVo,
  ClientUserVo,
} from 'src/core/models';
import { ClientUser } from 'src/infra/typeorm';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SysConfigService } from 'src/infra/services';
import { Role } from 'src/core/constants/enums/role.enum';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ClientUserService {
  constructor(
    @InjectRepository(ClientUser)
    private readonly clientUserRepository: Repository<ClientUser>,
    private readonly sysConfigService: SysConfigService,
  ) {}

  async add(vo: ClientUserVo): Promise<ClientUserResVo> {
    const passwordHash = await bcrypt.hash(
      vo.password,
      this.sysConfigService.infra.saltRounds,
    );
    const newUser = this.clientUserRepository.create(
      new ClientUserDto({
        userName: vo.userName,
        account: vo.account,
        password: passwordHash,
        email: vo.email,
        phone: vo.phone,
        address: vo.address,
      }),
    );
    const result = await this.clientUserRepository.save(newUser);
    return plainToInstance(ClientUserResVo, result);
  }

  async isUserExist(account: string): Promise<boolean> {
    const user = await this.clientUserRepository.findOne({
      where: { account },
    });
    return user ? true : false;
  }

  //TODO: 目前clent沒有localStrategy登入，所以先拔掉
  // async validate(account: string, password: string) {
  //   let role = Role.COSTUMER;

  //   const buser = await this.clientUserRepository.findOne({
  //     where: { account },
  //   });

  //   if (!buser) {
  //     throw new BadRequestException('User not found');
  //   }
  //   role = Role.BUSINESS;
  //   const isPasswordValid = await bcrypt.compare(password, buser.password);
  //   if (!isPasswordValid) {
  //     throw new BadRequestException('Password not valid');
  //   }

  //   if (buser.userName == 'admin') {
  //     role = Role.ADMIN;
  //   }

  //   return { user: buser, role: role };
  // }

  async update(vo: ClientUserUpdateReqVo): Promise<ClientUserResVo> {
    const toUpdate = await this.clientUserRepository.findOne({
      where: { id: vo.id },
    });
    if (!toUpdate) {
      throw new Error(`BusinessUser with id ${vo.id} not found`);
    }
    const updated = Object.assign(toUpdate, vo);
    const result = await this.clientUserRepository.save(updated);
    return plainToInstance(ClientUserResVo, result);
  }

  async delete(id: string): Promise<boolean> {
    const tooDelete = await this.clientUserRepository.findOne({
      where: { id },
    });
    if (!tooDelete) {
      throw new Error(`BusinessUser with id ${id} not found`);
    }
    return !!this.clientUserRepository.delete(id);
  }

  async get(id: string): Promise<ClientUserResVo> {
    const result = await this.clientUserRepository.findOne({ where: { id } });
    return plainToInstance(ClientUserResVo, result);
  }

  async getByKey(key: string): Promise<ClientUserResVo[]> {
    const vos = await this.clientUserRepository.find({
      where: { userName: Like(`%${key}%`) },
      order: { updatedAt: 'DESC' },
    });
    return vos.map((vo) => plainToInstance(ClientUserResVo, vo));
  }

  async getByAccount(account: string) {
    const user = await this.clientUserRepository.findOne({
      where: { account },
    });
    return plainToInstance(ClientUserResVo, user);
  }

  async getLineProfile(id: string): Promise<ClientUserResVo> {
    const result = await this.clientUserRepository.findOne({ where: { id } });
    return plainToInstance(ClientUserResVo, result);
  }
}
