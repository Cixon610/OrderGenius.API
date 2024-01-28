import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/core/guards/role/role.guard';
import { LineProfileVo } from 'src/core/models';
import { ClientUserService, LineService } from 'src/core/services';

// @UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('clientUser')
@Controller('clientUser')
export class ClientUserController {
  constructor(
    private readonly lineService: LineService,
    private readonly clientUserService: ClientUserService,
  ) {}

  @Get()
  // @ApiBearerAuth()
  @ApiResponse({ status: 200, type: LineProfileVo })
  async Get(@Query('clientUserId') id: string, @Res() res) {
    //TODO: 如果id不是uuid return 400
    const clientUser = await this.clientUserService.get(id);
    const vo = await this.lineService.findLineAccountByLineId(clientUser.account);
    res.json(vo);
  }
}
