import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RedisService } from 'src/infra/services';

@ApiTags('test')
@Controller('test')
export class TestController {
  constructor(private readonly redisService: RedisService) {}

  @Get()
  async Add(@Query() id, @Res() res) {
    const req = await this.redisService.set('test', 'test');
    const vo = await this.redisService.get('test');
    res.json(vo);
  }
}
