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
import { MenuCategoryAddReqVo, MenuCategoryResVo, MenuCategoryUpdateReqVo } from 'src/core/models';
import { MenuCategoryService } from 'src/core/services';

@ApiTags('menuCategory')
@Controller('menuCategory')
export class MenuCategoryController {
  constructor(private readonly menuCategoryService: MenuCategoryService) {}

  @Post()
  @ApiResponse({ status: 200, type: MenuCategoryResVo })
  async Add(@Body() dto: MenuCategoryAddReqVo, @Res() res) {
    const vo = await this.menuCategoryService.add(dto);
    res.json(vo);
  }

  @Put()
  @ApiResponse({ status: 200, type: MenuCategoryResVo })
  async Update(@Body() menuDto: MenuCategoryUpdateReqVo, @Res() res) {
    const vo = await this.menuCategoryService.update(menuDto);
    res.json(vo);
  }

  @Delete(':menuCategoryId')
  @ApiResponse({ status: 200, type: MenuCategoryResVo })
  async Delete(@Param('menuCategoryId') menuId: string, @Res() res) {
    const sucess = await this.menuCategoryService.delete(menuId);
    res.json(sucess);
  }

  @Get()
  @ApiResponse({ status: 200, type: MenuCategoryResVo })
  async Get(@Query('id') id: string, @Res() res) {
    const vo = await this.menuCategoryService.get(id);
    res.json(vo);
  }
  
  @Get('key')
  @ApiResponse({ status: 200, type: [MenuCategoryResVo] })
  async GetByKey(@Query('key') key: string, @Res() res) {
    const vos = await this.menuCategoryService.getByKey(key);
    res.json(vos);
  }

  @Get(':businessId')
  @ApiResponse({ status: 200, type: [MenuCategoryResVo] })
  async GetByBusiness(@Param('businessId') id: string, @Res() res) {
    const vos = await this.menuCategoryService.getByBusinessId(id);
    res.json(vos);
  }
}
