import {
  Controller,
  Get,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LineService } from 'src/core/services';

@ApiTags('line')
@Controller('line')
export class LineController {
  constructor(
    private readonly lineService: LineService,
  ) {}

  @Get('login')
  async login(@Res() res) {
    const loginUrl = await this.lineService.getLineLoginUrl();
    res.json({ url: loginUrl });
  }

  @Get('callback')
  @UsePipes(ValidationPipe)
  async callback(@Req() req, @Res() res) {
    const { code } = req.query;
    const profile = await this.lineService.getLineProfile(code);
    res.json({ profile: profile });
  }
}
