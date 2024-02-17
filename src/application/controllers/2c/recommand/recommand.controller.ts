import { RecommandService } from './../../../../core/services/bu/client/recommand/recommand.service';
import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/core/guards/role/role.guard';
import { MenuItemResVo } from 'src/core/models';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('recommand')
@Controller('recommand')
export class RecommandController {
  constructor(private readonly recommandService: RecommandService) {}

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: [MenuItemResVo] })
  async get(@Query('businessId') businessId: string, @Req() req, @Res() res) {
    const vo = await this.recommandService.getItem(businessId, req.user.id);
    res.json(vo);
  }

  @Get('itemNames')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: [String] })
  async getItemNames(
    @Query('businessId') businessId: string,
    @Req() req,
    @Res() res,
  ) {
    const vo = await this.recommandService.getItemNames(
      businessId,
      req.user.id,
    );
    res.json(vo);
  }
}
