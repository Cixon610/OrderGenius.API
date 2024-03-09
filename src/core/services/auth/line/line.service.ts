import {
  BusinessUserVo,
  ClientUserProfileVo,
  ClientUserVo,
  IUserPayload,
  LineAccountDto,
  LineCallbackResVo,
  LineProfileVo,
  UserProfileVo,
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
import { ClientUserService } from '../../bu/client/client.user/client.user.service';
import { BusinessUserService } from '../../bu/business/business.user/business.user.service';
import { plainToInstance } from 'class-transformer';

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

  async getLoginUrl(oringin: string, businessId: string): Promise<string> {
    const { type, protalUrl } = this.#getProtalUrl(oringin);
    const queryParams = stringify({
      response_type: 'code',
      client_id:
        type == '2B'
          ? this.sysConfigService.thirdParty.lineChannelId2B
          : this.sysConfigService.thirdParty.lineChannelId2C,
      redirect_uri: `https://${protalUrl}?businessId=${businessId}`,
      scope: 'openid profile',
      state: randomBytes(16).toString('hex'),
      nonce: randomBytes(16).toString('hex'),
    });

    const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?${queryParams}`;
    return Promise.resolve(loginUrl);
  }

  async login(
    code: string,
    oringin: string,
    businessId: string,
  ): Promise<LineCallbackResVo> {
    const { type, protalUrl } = this.#getProtalUrl(oringin);
    const Is2BProtal = type == '2B';
    const accessToken = await this.#getLineAccessToken(
      code,
      protalUrl,
      Is2BProtal,
      businessId,
    );
    let profile = await this.#getLineProfile(accessToken);

    //檢查建立Line帳號
    this.#checkLineAccount(profile);

    profile = Is2BProtal
      ? await this.#businessLogin(profile)
      : await this.#clientLogin(profile);

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

  async findLineAccountByLineId(lineId: string): Promise<ClientUserProfileVo> {
    //TODO:之後串其他登入要抽出共用的欄位在統一
    const result = this.lineAccountRepository.findOne({ where: { lineId } });
    return plainToInstance(ClientUserProfileVo, result);
  }

  //#region private
  #getProtalUrl(oringin: string): { type: string; protalUrl: string } {
    oringin = oringin.replace('https://', '').replace('http://', '');
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
    businessId: string,
  ): Promise<string> {
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
          //TODO:redirect帶businessId讓轉導時帶入
          redirect_uri: `https://${protalUrl}?businessId=${businessId}`,
        },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
      return tokenResponse.data.access_token;
    } catch (error) {
      console.error(error);
    }
  }

  async #businessLogin(profile: LineProfileVo): Promise<UserProfileVo> {
    let user = await this.businessUserService.getByAccount(profile.userId);
    if (!user) {
      user = await this.businessUserService.add(
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
    }

    return new UserProfileVo({
      userId: user.id,
      displayName: user.userName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage,
      businessId: user.businessId,
    });
  }

  async #clientLogin(profile: LineProfileVo): Promise<UserProfileVo> {
    let user = await this.clientUserService.getByAccount(profile.userId);
    if (!user) {
      user = await this.clientUserService.add(
        new ClientUserVo({
          userName: profile.displayName,
          account: profile.userId,
          password: 'pass.123', //TODO: 抽出pwd或rnd
          email: '',
          phone: '',
          address: '',
        }),
      );
    }

    return new UserProfileVo({
      userId: user.id,
      displayName: user.userName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage,
      //clientUser不須businessId
      businessId: this.sysConfigService.common.defaultBzId,
    });
  }
  //#endregion
}
