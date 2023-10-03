import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLineAccountDto, LineProfileDto } from 'src/core/models';
import { LineAccount } from 'src/infra/typeorm';
import { randomBytes } from 'crypto';
import { stringify } from 'qs';
import { SysConfigService } from 'src/infra/services';
import axios from 'axios';

@Injectable()
export class LineService {
  constructor(
    @InjectRepository(LineAccount)
    private readonly lineAccountRepository: Repository<LineAccount>,
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
    const { userId, displayName, pictureUrl, statusMessage } = profile;

    const user = await this.findLineAccountByLineId(userId);
    if (!user) {
      await this.createLineAccount({
        lineId: userId,
        displayName: displayName,
        pictureUrl: pictureUrl,
        statusMessage: statusMessage,
        creationTime: new Date(),
        updateTime: new Date(),
      });
    }
    return profile;
  }

  async createLineAccount(
    createLineAccountDto: CreateLineAccountDto,
  ): Promise<LineAccount> {
    const newLineAccount =
      this.lineAccountRepository.create(createLineAccountDto);
    return this.lineAccountRepository.save(newLineAccount);
  }

  async findLineAccountByLineId(lineId: string): Promise<LineAccount> {
    return this.lineAccountRepository.findOne({ where: { lineId } });
  }
}
