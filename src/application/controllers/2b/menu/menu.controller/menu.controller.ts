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
    const vo = await this.menuService.add(menuDto);
    res.json(vo);
  }

  @Put()
  @ApiResponse({ status: 200, type: MenuUpdateReqVo })
  async Update(@Body() menuDto: MenuUpdateReqVo, @Res() res) {
    const vo = await this.menuService.update(menuDto);
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
    const vo = await this.menuService.get(id);
    res.json(vo);
  }

  @Get(':businessId')
  @ApiResponse({ status: 200, type: [MenuResVo] })
  async GetByBusiness(@Param('businessId') id: string, @Res() res) {
    const vos = await this.menuService.getByBusinessId(id);
    res.json(vos);
  }
}
