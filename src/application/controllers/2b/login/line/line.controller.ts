import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LineCallbackResVo, LineLoginResVo } from 'src/core/models';
import { LineService } from 'src/core/services';
import { SysConfigService } from 'src/infra/services';

@ApiTags('line')
@Controller('line')
export class LineController {
  constructor(
    private readonly lineService: LineService,
    private readonly sysConfigService: SysConfigService,
  ) {}

  @ApiResponse({ status: 200, type: LineLoginResVo })
  @Get('login')
  async login(@Req() req, @Res() res) {
    const origin =
      req.headers.host == 'localhost:9000'
        ? this.sysConfigService.infra.clientUrl2B
        : req.headers.origin;
    const loginUrl = await this.lineService.getLoginUrl(origin);
    res.json(new LineLoginResVo({ url: loginUrl }));
  }

  @ApiResponse({ status: 200, type: LineCallbackResVo })
  @Get('callback')
  async callback(@Req() req, @Res() res) {
    const origin =
      req.headers.host == 'localhost:9000'
        ? this.sysConfigService.infra.clientUrl2B
        : req.headers.origin;
    const { code } = req.query;
    const result = await this.lineService.login(code, origin);
    res.json(result);
  }
}
