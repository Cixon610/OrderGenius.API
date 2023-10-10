import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BusinessUserDto, UserCreateReqVo, UserResVo } from 'src/core/models';
import { UserService } from 'src/core/services';

@ApiTags('Business/User')
@Controller('business/user')
export class BusinessUserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
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
}
