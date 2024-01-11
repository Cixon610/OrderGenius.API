import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LineCallbackResVo, LineLoginResVo } from 'src/core/models';
import { LineService } from 'src/core/services';

@ApiTags('line')
@Controller('line')
export class LineController {
  constructor(private readonly lineService: LineService) {}

  @ApiResponse({ status: 200, type: LineLoginResVo })
  @Get('login')
  async login(@Req() req, @Res() res) {
    console.debug('headers', req.headers);
    const loginUrl = await this.lineService.getLoginUrl(req.headers.host);
    res.json(new LineLoginResVo({ url: loginUrl }));
  }

  @ApiResponse({ status: 200, type: LineCallbackResVo })
  @Get('callback')
  async callback(@Req() req, @Res() res) {
    const { code } = req.query;
    const result = await this.lineService.login(code, req.headers.host);
    res.json(result);
  }
}
