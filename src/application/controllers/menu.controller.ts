import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { MenuAddReqVo, MenuAddResVo, MenuAddRes } from 'src/core/models';
import { MenuService } from 'src/core/services';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiResponse({ status: 200, type: MenuAddResVo })
  async Add(@Body() menuDto: MenuAddReqVo, @Res() res) {
    const menu = await this.menuService.add(menuDto);
    const result = new MenuAddResVo(
      new MenuAddRes({
        id: menu.id,
        businessId: menu.businessId,
        name: menu.name,
        description: menu.description,
      }),
    );
    res.json(result);
  }

  @Get()
  async Get(@Query('id') id: string, @Res() res) {
    const result = await this.menuService.get(id);
    res.json({ data: { result } });
  }
}
