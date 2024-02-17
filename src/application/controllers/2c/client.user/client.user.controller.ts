import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/core/guards/role/role.guard';
import { UserProfileVo } from 'src/core/models';
import { ClientUserService, LineService } from 'src/core/services';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('clientUser')
@Controller('clientUser')
export class ClientUserController {
  constructor(
    private readonly lineService: LineService,
    private readonly clientUserService: ClientUserService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UserProfileVo })
  async Get(@Query('clientUserId') id: string, @Req() req, @Res() res) {
    //取得clientUserId不是自己的資料則回傳401
    if (req.user.id !== id) {
      res.status(401);
      return;
    }

    const clientUser = await this.clientUserService.get(id);
    if (!clientUser) {
      res.status(400).json('clientUserId is not found');
      return;
    }

    const lineAccount = await this.lineService.findLineAccountByLineId(
      clientUser.account,
    );

    const vo = new UserProfileVo({
      userId: clientUser.id,
      displayName: lineAccount.displayName,
      pictureUrl: lineAccount.pictureUrl,
      statusMessage: lineAccount.statusMessage,
    });
    res.json(vo);
  }
}
