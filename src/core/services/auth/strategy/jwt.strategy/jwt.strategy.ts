import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserPayload } from 'src/core/models';
import { SysConfigService } from 'src/infra/services';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(sysConfigService: SysConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: sysConfigService.infra.jwtSecret,
    });
  }

  validate(payload: Record<string, any>) {
    const { id, username, role, businessId } = payload;
    const userPayload: IUserPayload = {
      id,
      username,
      role,
      businessId,
    };
    return userPayload;
  }
}
