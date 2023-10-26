import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserPayload } from 'src/core/decorator/user-payload.decorator';
import { RoleGuard } from 'src/core/guards/role/role.guard';
import {
  BusinessUserDto,
  IUserPayload,
  LoginReqVo,
  UserCreateReqVo,
  UserResVo,
} from 'src/core/models';
import { UserService } from 'src/core/services';

@ApiTags('Business/User')
@Controller('business/user')
export class BusinessUserController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('create')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UserResVo })
  async create(@Body() dto: UserCreateReqVo, @Res() res) {
    if (await this.userService.isUserExist(dto.account)) {
      throw new BadRequestException('User already exist');
    }

    const vo = await this.userService.create2bUser(
      new BusinessUserDto({
        businessId: dto.businessId,
        userName: dto.userName,
        account: dto.account,
        password: dto.password,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
      }),
    );
    res.json(vo);
  }

  @UseGuards(AuthGuard('local'))
  @Post('signIn/local')
  async signInLocal(
    @UserPayload() user: IUserPayload,
    @Body() swaggermodel: LoginReqVo,
    @Res() res,
  ) {
    return res.json({ token: this.jwtService.sign(user) });
  }
}
