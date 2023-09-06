import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { MenuDto } from './menu.dto';
import { MenuService } from './menu.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  async Add(@Body() menuDto: MenuDto, @Res() res) {
    const result = await this.menuService.add(menuDto);
    res.json({ data: { result } });
  }
  @Get()
  async Get(@Query('id') id: string, @Res() res) {
    const result = await this.menuService.get(id);
    res.json({ data: { result } });
  }
}
