import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserPayload } from 'src/core/models';
import { BusinessUserService, ClientUserService } from 'src/core/services';
import { SysConfigService } from 'src/infra/services';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly sysConfigService: SysConfigService,
    private readonly businessUserService: BusinessUserService,
    private readonly clientUserService: ClientUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: sysConfigService.infra.jwtSecret,
    });
  }

  async validate(payload: Record<string, any>): Promise<IUserPayload> {
    const { id, username, role, businessId } = payload;
    const userPayload: IUserPayload = {
      id,
      username,
      role,
      businessId,
    };

    switch (role) {
      case 'business':
        return (
          (await this.businessUserService.isUserExist(username)) && userPayload
        );

      case 'client':
        return (
          (await this.clientUserService.isUserExist(username)) && userPayload
        );
      default:
        throw new UnauthorizedException('User not found');
    }
  }
}
