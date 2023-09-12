import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { MenuAddReqVo, MenuAddResVo } from 'src/core/models';
import { MenuService } from 'src/core/services';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  async Add(@Body() menuDto: MenuAddReqVo, @Res() res: MenuAddResVo) {
    const result = await this.menuService.add(menuDto);
    //TODO:修改迴傳型別
    res.json(MenuAddResVo);
  }
  @Get()
  async Get(@Query('id') id: string, @Res() res) {
    const result = await this.menuService.get(id);
    res.json({ data: { result } });
  }
}
