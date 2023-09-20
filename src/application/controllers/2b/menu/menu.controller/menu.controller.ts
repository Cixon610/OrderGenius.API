import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';``
import { MenuAddReqVo, MenuResVo, MenuUpdateReqVo } from 'src/core/models';
import { MenuService } from 'src/core/services';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiResponse({ status: 200, type: MenuResVo })
  async Add(@Body() menuDto: MenuAddReqVo, @Res() res) {
    const menu = await this.menuService.add(menuDto);
    const vo = new MenuResVo({
      id: menu.id,
      businessId: menu.businessId,
      name: menu.name,
      description: menu.description,
    });
    res.json(vo);
  }

  @Put()
  @ApiResponse({ status: 200, type: MenuUpdateReqVo })
  async Update(@Body() menuDto: MenuUpdateReqVo, @Res() res) {
    const menu = await this.menuService.update(menuDto);
    const vo = new MenuResVo({
      id: menu.id,
      businessId: menu.businessId,
      name: menu.name,
      description: menu.description,
    });
    res.json(vo);
  }

  @Delete(':menuId')
  @ApiResponse({ status: 200, type: MenuResVo })
  async Delete(@Param('menuId') menuId: string, @Res() res) {
    const sucess = await this.menuService.delete(menuId);
    res.json(sucess);
  }

  @Get()
  @ApiResponse({ status: 200, type: MenuResVo })
  async Get(@Query('id') id: string, @Res() res) {
    const menu = await this.menuService.get(id);
    const vo = new MenuResVo({
      id: menu.id,
      businessId: menu.businessId,
      name: menu.name,
      description: menu.description,
    });
    res.json(vo);
  }

  @Get(':businessId')
  @ApiResponse({ status: 200, type: [MenuResVo] })
  async GetByBusiness(@Param('businessId') id: string, @Res() res) {
    const menu = await this.menuService.getByBusinessId(id);
    const vos = menu.map(
      (x) =>
        new MenuResVo({
          id: x.id,
          businessId: x.businessId,
          name: x.name,
          description: x.description,
        }),
    );
    res.json(vos);
  }
}
