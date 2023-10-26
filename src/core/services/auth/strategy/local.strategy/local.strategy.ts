import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { IUserPayload } from 'src/core/models';
import { UserService } from '../../user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(username: string, password: string) {
    const { user, role } = await this.userService.validate(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload: IUserPayload = {
      id: user.id,
      username: user.userName,
      role: role,
      businessId: user.businessId,
    };

    return payload;
  }
}
