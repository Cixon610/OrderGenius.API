import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/core/guards/role/role.guard';
import { LineProfileVo } from 'src/core/models';
import { LineService } from 'src/core/services';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('clientUser')
@Controller('clientUser')
export class ClientUserController {
    constructor(private readonly lineService: LineService) {}

    @Get()
    @ApiBearerAuth()
    @ApiResponse({ status: 200, type: LineProfileVo })
    async Get(@Query('lineId') id: string, @Res() res) {
      const vo = await this.lineService.findLineAccountByLineId(id);
      res.json(vo);
    }
}
