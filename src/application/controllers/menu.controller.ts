import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { MenuAddReqVo } from 'src/core/models';
import { MenuService } from 'src/core/services';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  async Add(@Body() menuDto: MenuAddReqVo, @Res() res) {
    const result = await this.menuService.add(menuDto);
    res.json({ data: { result } });
  }
  @Get()
  async Get(@Query('id') id: string, @Res() res) {
    const result = await this.menuService.get(id);
    res.json({ data: { result } });
  }
}
