import {
  BusinessUserVo,
  ClientUserVo,
  IUserPayload,
  LineAccountDto,
  LineCallbackResVo,
  LineProfileVo,
} from 'src/core/models';
import axios from 'axios';
import { stringify } from 'qs';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { LineAccount } from 'src/infra/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SysConfigService } from 'src/infra/services';
import { Role } from 'src/core/constants/enums/role.enum';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ClientUserService } from '../../bu/client.user/client.user.service';
import { BusinessUserService } from '../../bu/business/business.user/business.user.service';

@Injectable()
export class LineService {
  constructor(
    @InjectRepository(LineAccount)
    private readonly lineAccountRepository: Repository<LineAccount>,
    private readonly jwtService: JwtService,
    private readonly sysConfigService: SysConfigService,
    private readonly clientUserService: ClientUserService,
    private readonly businessUserService: BusinessUserService,
  ) {}

  async getLoginUrl(oringin: string): Promise<string> {
    const { type, protalUrl } = this.#getProtalUrl(oringin);
    const queryParams = stringify({
      response_type: 'code',
      client_id:
        type == '2B'
          ? this.sysConfigService.thirdParty.lineChannelId2B
          : this.sysConfigService.thirdParty.lineChannelId2C,
      redirect_uri: `https://${protalUrl}`,
      scope: 'openid profile',
      state: randomBytes(16).toString('hex'),
      nonce: randomBytes(16).toString('hex'),
    });

    const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?${queryParams}`;
    return Promise.resolve(loginUrl);
  }

  async login(code: string, oringin: string): Promise<LineCallbackResVo> {
    const { type, protalUrl } = this.#getProtalUrl(oringin);
    const Is2BProtal = type == '2B';
    const accessToken = await this.#getLineAccessToken(
      code,
      protalUrl,
      Is2BProtal,
    );
    let profile = await this.#getLineProfile(accessToken);

    profile = Is2BProtal
      ? await this.#businessLogin(profile)
      : await this.#clientLogin(profile);

    //檢查建立Line帳號
    this.#checkLineAccount(profile);

    const accountWithoutBusiness =
      profile.businessId == this.sysConfigService.common.defaultBzId;

    const userPayload: IUserPayload = {
      id: profile.userId,
      username: profile.displayName,
      role: accountWithoutBusiness ? Role.COSTUMER : Role.BUSINESS,
      businessId: profile.businessId,
    };

    return new LineCallbackResVo({
      profile: profile,
      businessId: profile.businessId,
      token: this.jwtService.sign(userPayload),
    });
  }

  async findLineAccountByLineId(lineId: string): Promise<LineAccount> {
    return this.lineAccountRepository.findOne({ where: { lineId } });
  }

  //#region private
  #getProtalUrl(oringin: string): { type: string; protalUrl: string } {
    oringin = oringin.replace('https://', '');
    if (oringin == this.sysConfigService.infra.clientUrl2B)
      return { type: '2B', protalUrl: this.sysConfigService.infra.clientUrl2B };
    if (oringin == this.sysConfigService.infra.clientUrl2C)
      return { type: '2C', protalUrl: this.sysConfigService.infra.clientUrl2C };
    throw new BadRequestException(`Invalid oringin: ${oringin}`);
  }

  async #checkLineAccount(profile: LineProfileVo): Promise<boolean> {
    try {
      const user = await this.findLineAccountByLineId(profile.userId);
      if (!user) {
        const newLineAccount = this.lineAccountRepository.create(
          new LineAccountDto({
            lineId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
            statusMessage: profile.statusMessage,
          }),
        );
        this.lineAccountRepository.save(newLineAccount);
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async #getLineProfile(access_token: string): Promise<LineProfileVo> {
    try {
      const profileResponse = await axios.get(
        'https://api.line.me/v2/profile',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const profile: LineProfileVo = profileResponse.data;
      return profile;
    } catch (error) {
      console.error(error);
    }
  }

  async #getLineAccessToken(
    code: string,
    protalUrl: string,
    is2BProtal: boolean,
  ) {
    const channelId = is2BProtal
      ? this.sysConfigService.thirdParty.lineChannelId2B
      : this.sysConfigService.thirdParty.lineChannelId2C;
    const channelSecret = is2BProtal
      ? this.sysConfigService.thirdParty.lineChannelSecret2B
      : this.sysConfigService.thirdParty.lineChannelSecret2C;

    try {
      const tokenResponse = await axios.post(
        'https://api.line.me/oauth2/v2.1/token',
        {
          grant_type: 'authorization_code',
          code,
          client_id: channelId,
          client_secret: channelSecret,
          redirect_uri: `https://${protalUrl}`,
        },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
      return tokenResponse.data.access_token;
    } catch (error) {
      console.error(error);
    }
  }

  async #businessLogin(profile: LineProfileVo): Promise<LineProfileVo> {
    const user = await this.businessUserService.getByAccount(profile.userId);
    let userId = this.sysConfigService.common.defaultBzId;
    if (!user) {
      const user = await this.businessUserService.add(
        new BusinessUserVo({
          userName: profile.displayName,
          account: profile.userId,
          password: 'pass.123', //TODO: 抽出pwd或rnd
          email: '',
          phone: '',
          address: '',
          businessId: this.sysConfigService.common.defaultBzId,
        }),
      );
      userId = user.id;
    }

    profile.userId = userId;
    profile.businessId = user.businessId;

    return profile;
  }

  async #clientLogin(profile: LineProfileVo): Promise<LineProfileVo> {
    const user = await this.clientUserService.getByAccount(profile.userId);
    let userId = this.sysConfigService.common.defaultBzId;
    if (!user) {
      const user = await this.clientUserService.add(
        new ClientUserVo({
          userName: profile.displayName,
          account: profile.userId,
          password: 'pass.123', //TODO: 抽出pwd或rnd
          email: '',
          phone: '',
          address: '',
        }),
      );
      userId = user.id;
    }

    //clientUser不須businessId
    profile.businessId = '';
    profile.userId = userId;

    return profile;
  }
  //#endregion
}
