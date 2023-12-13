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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/core/guards/role/role.guard';
import { MenuVo, MenuResVo, MenuUpdateReqVo } from 'src/core/models';
import { MenuService } from 'src/core/services';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: MenuResVo })
  async Add(@Body() menuDto: MenuVo, @Res() res) {
    const vo = await this.menuService.add(menuDto);
    res.json(vo);
  }

  @Put()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: MenuUpdateReqVo })
  async Update(@Body() menuDto: MenuUpdateReqVo, @Res() res) {
    const vo = await this.menuService.update(menuDto);
    res.json(vo);
  }

  @Delete(':menuId')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: Boolean })
  async Delete(@Param('menuId') menuId: string, @Res() res) {
    const sucess = await this.menuService.delete(menuId);
    res.json(sucess);
  }

  @Delete()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: Boolean })
  async DeleteMany(@Body() menuIds: string[], @Res() res) {
    const success = await Promise.all(
      menuIds.map((Id) => this.menuService.delete(Id))
    );
    const result = success.reduce((result, value) => result && value, true);
    res.json(result);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: MenuResVo })
  async Get(@Query('id') id: string, @Res() res) {
    const vo = await this.menuService.get(id);
    res.json(vo);
  }


  @Get('key')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: [MenuResVo] })
  async GetByKey(@Query('key') key: string, @Res() res) {
    const vos = await this.menuService.getByKey(key);
    res.json(vos);
  }

  @Get(':businessId')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: [MenuResVo] })
  async GetByBusiness(@Param('businessId') id: string, @Res() res) {
    const vos = await this.menuService.getByBusinessId(id);
    res.json(vos);
  }
}
