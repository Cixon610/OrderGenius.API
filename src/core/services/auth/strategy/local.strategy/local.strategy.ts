import { Strategy } from 'passport-local';
import { IUserPayload } from 'src/core/models';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BusinessUserService } from 'src/core/services/bu/business/business.user/business.user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly businessUserService: BusinessUserService) {
    super();
  }

  async validate(username: string, password: string) {
    const { user, role } = await this.businessUserService.validate(
      username,
      password,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload: IUserPayload = {
      role: role,
      id: user.id,
      username: user.userName,
      businessId: user.businessId,
    };

    return payload;
  }
}
