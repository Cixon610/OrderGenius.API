import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserPayload } from 'src/core/decorator/user-payload.decorator';
import { IUserPayload, LoginReqVo, LoginResVo } from 'src/core/models';

@ApiTags('Business/User')
@Controller('business/user')
export class BusinessUserAuthController {
  constructor(private readonly jwtService: JwtService) {}

  @UseGuards(AuthGuard('local'))
  @ApiResponse({ status: 200, type: LoginResVo })
  @Post('login')
  async login(
    @UserPayload() user: IUserPayload,
    @Body() swaggermodel: LoginReqVo,
    @Res() res,
  ) {
    return res.json(
      new LoginResVo({
        businessId: user.businessId,
        token: this.jwtService.sign(user),
      }),
    );
  }
}
