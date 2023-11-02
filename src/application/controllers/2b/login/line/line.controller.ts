import {
  Controller,
  Get,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/core/constants/enums/role.enum';
import { IUserPayload } from 'src/core/models';
import { LineService, UserService } from 'src/core/services';

@ApiTags('line')
@Controller('line')
export class LineController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly lineService: LineService,
    private readonly userService: UserService,
  ) {}

  @Get('login')
  async login(@Res() res) {
    const loginUrl = await this.lineService.getLineLoginUrl();
    res.json({ url: loginUrl });
  }

  @Get('callback')
  @UsePipes(ValidationPipe)
  async callback(@Req() req, @Res() res) {
    const { code } = req.query;
    const profile = await this.lineService.getLineProfile(code);
    const businessUser = await this.userService.find(profile.userId);
    const userPayload: IUserPayload = {
      id: businessUser.id,
      username: businessUser.userName,
      role: Role.BUSINESS,
      businessId: businessUser.businessId,
    };
    
    res.json({
      profile: profile,
      token: this.jwtService.sign(userPayload),
    });
  }
}
