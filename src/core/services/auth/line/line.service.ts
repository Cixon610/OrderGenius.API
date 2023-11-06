import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineAccountAddReqVo, LineProfileDto } from 'src/core/models';
import { LineAccount } from 'src/infra/typeorm';
import { randomBytes } from 'crypto';
import { stringify } from 'qs';
import { SysConfigService } from 'src/infra/services';
import axios from 'axios';
import { BusinessUserService } from '../../bu/business/business.user/business.user.service';

@Injectable()
export class LineService {
  constructor(
    @InjectRepository(LineAccount)
    private readonly lineAccountRepository: Repository<LineAccount>,
    private readonly businessUserService: BusinessUserService,
    private readonly sysConfigService: SysConfigService,
  ) {}

  async getLineLoginUrl(): Promise<string> {
    const queryParams = stringify({
      response_type: 'code',
      client_id: this.sysConfigService.thirdParty.lineChannelId,
      redirect_uri: this.sysConfigService.infra.clientUrl,
      state: randomBytes(16).toString('hex'),
      scope: 'openid profile',
      nonce: randomBytes(16).toString('hex'),
    });

    const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?${queryParams}`;
    return Promise.resolve(loginUrl);
  }

  async getLineProfile(code: string): Promise<LineProfileDto> {
    const tokenResponse = await axios.post(
      'https://api.line.me/oauth2/v2.1/token',
      {
        grant_type: 'authorization_code',
        code,
        client_id: this.sysConfigService.thirdParty.lineChannelId,
        client_secret: this.sysConfigService.thirdParty.lineChannelSecret,
        redirect_uri: this.sysConfigService.infra.clientUrl,
      },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
    const { access_token } = tokenResponse.data;

    const profileResponse = await axios.get('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const profile: LineProfileDto = profileResponse.data;
    const buser = await this.businessUserService.getByAccount(profile.userId);
    if (!buser) {
      const user = await this.businessUserService.add({
        userName: profile.displayName,
        account: profile.userId,
        password: 'pass.123',
        email: '',
        phone: '',
        address: '',
        businessId: '00000000-0000-0000-0000-000000000000',
      });
      profile.businessId = user.businessId;
    }
    else{
      profile.businessId = buser.businessId;
    }

    const user = await this.findLineAccountByLineId(profile.userId);
    if (!user) {
      await this.createLineAccount(
        new LineAccountAddReqVo({
          lineId: profile.userId,
          displayName: profile.displayName,
          businessUserId: !!profile.businessId ? profile.businessId : '00000000-0000-0000-0000-000000000000',
          pictureUrl: profile.pictureUrl,
          statusMessage: profile.statusMessage,
          creationTime: new Date(),
          updateTime: new Date(),
        }),
      );
    }

    return profile;
  }

  async createLineAccount(
    createLineAccountDto: LineAccountAddReqVo,
  ): Promise<LineAccount> {
    const newLineAccount =
      this.lineAccountRepository.create(createLineAccountDto);
    return this.lineAccountRepository.save(newLineAccount);
  }

  async findLineAccountByLineId(lineId: string): Promise<LineAccount> {
    return this.lineAccountRepository.findOne({ where: { lineId } });
  }
}
