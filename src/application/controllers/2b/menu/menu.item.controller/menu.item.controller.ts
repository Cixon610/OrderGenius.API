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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MenuItemService } from 'src/core/services';
import { MenuItemAddReqVo, MenuItemResVo, MenuItemUpdateReqVo } from 'src/core/models';

@ApiTags('menuItem')
@Controller('menuItem')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  @ApiResponse({ status: 200, type: MenuItemResVo })
  async Add(@Body() menuItemVo: MenuItemAddReqVo, @Res() res) {
    const vo = await this.menuItemService.add(menuItemVo);
    res.json(vo);
  }

  @Put()
  @ApiResponse({ status: 200, type: MenuItemResVo })
  async Update(@Body() menuDto: MenuItemUpdateReqVo, @Res() res) {
    const vo = await this.menuItemService.update(menuDto);
    res.json(vo);
  }

  @Delete(':menuItemId')
  @ApiResponse({ status: 200, type: MenuItemResVo })
  async Delete(@Param('menuItemId') menuId: string, @Res() res) {
    const sucess = await this.menuItemService.delete(menuId);
    res.json(sucess);
  }

  @Get()
  @ApiResponse({ status: 200, type: MenuItemResVo })
  async Get(@Query('id') id: string, @Res() res) {
    const vo = await this.menuItemService.get(id);
    res.json(vo);
  }
  
  @Get('key')
  @ApiResponse({ status: 200, type: [MenuItemResVo] })
  async GetByKey(@Query('key') key: string, @Res() res) {
    const vos = await this.menuItemService.getByKey(key);
    res.json(vos);
  }

  @Get(':businessId')
  @ApiResponse({ status: 200, type: [MenuItemResVo] })
  async GetByBusiness(@Param('businessId') id: string, @Res() res) {
    const vos = await this.menuItemService.getByBusinessId(id);
    res.json(vos);
  }
}
