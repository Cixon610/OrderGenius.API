import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/core/guards/role/role.guard';
import {
  BusinessUserDto,
  BusinessUserUpdateReqVo,
  BusinessUserAddReqVo,
  BusinessUserResVo,
} from 'src/core/models';
import { BusinessUserService } from 'src/core/services';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Business/User')
@Controller('business/user')
export class BusinessUserController {
  constructor(
    private readonly businessUserService: BusinessUserService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: BusinessUserResVo })
  async add(@Body() dto: BusinessUserAddReqVo, @Res() res) {
    if (await this.businessUserService.isUserExist(dto.account)) {
      throw new BadRequestException('User already exist');
    }

    const vo = await this.businessUserService.add(
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

  @Put()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: BusinessUserResVo })
  async Update(@Body() menuDto: BusinessUserUpdateReqVo, @Res() res) {
    const vo = await this.businessUserService.update(menuDto);
    res.json(vo);
  }

  @Delete(':businessUserId')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: BusinessUserResVo })
  async Delete(@Param('businessUserId') menuId: string, @Res() res) {
    const sucess = await this.businessUserService.delete(menuId);
    res.json(sucess);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: BusinessUserResVo })
  async Get(@Query('id') id: string, @Res() res) {
    const vo = await this.businessUserService.get(id);
    res.json(vo);
  }

  @Get('key')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: [BusinessUserResVo] })
  async GetByKey(@Query('key') key: string, @Res() res) {
    const vos = await this.businessUserService.getByKey(key);
    res.json(vos);
  }

  @Get(':businessId')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: [BusinessUserResVo] })
  async GetByBusiness(@Param('businessId') id: string, @Res() res) {
    const vos = await this.businessUserService.getByBusinessId(id);
    res.json(vos);
  }
}
