import { Controller, Get, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/core/constants/enums/role.enum';
import {
  IUserPayload,
  LineCallbackResVo,
  LineLoginResVo,
} from 'src/core/models';
import { LineService, BusinessUserService } from 'src/core/services';

@ApiTags('line')
@Controller('line')
export class LineController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly lineService: LineService,
    private readonly userService: BusinessUserService,
  ) {}

  @ApiResponse({ status: 200, type: LineLoginResVo })
  @Get('login')
  async login(@Res() res) {
    const loginUrl = await this.lineService.getLineLoginUrl();
    res.json(new LineLoginResVo({ url: loginUrl }));
  }

  @ApiResponse({ status: 200, type: LineCallbackResVo })
  @Get('callback')
  async callback(@Req() req, @Res() res) {
    const { code } = req.query;
    const profile = await this.lineService.getLineProfile(code);
    const businessUser = await this.userService.getByAccount(profile.userId);
    const userPayload: IUserPayload = {
      id: businessUser.id,
      username: businessUser.userName,
      role: Role.BUSINESS,
      businessId: businessUser.businessId,
    };

    res.json(
      new LineCallbackResVo({
        profile: profile,
        businessId: businessUser.businessId,
        token: this.jwtService.sign(userPayload),
      }),
    );
  }
}
