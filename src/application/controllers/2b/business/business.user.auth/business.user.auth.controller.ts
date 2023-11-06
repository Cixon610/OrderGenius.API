import { Body, Controller, Post, Res, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { UserPayload } from "src/core/decorator/user-payload.decorator";
import { IUserPayload, LoginReqVo } from "src/core/models";

@ApiTags('Business/User')
@Controller('business/user')
export class BusinessUserAuthController {
  constructor(
    private readonly jwtService: JwtService,
  ) {}
  
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @UserPayload() user: IUserPayload,
    @Body() swaggermodel: LoginReqVo,
    @Res() res,
  ) {
    //TODO: 包成class
    return res.json({
      businessId: user.businessId,
      token: this.jwtService.sign(user),
    });
  }
}
