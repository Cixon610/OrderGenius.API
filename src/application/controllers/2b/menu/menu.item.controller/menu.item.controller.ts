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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MenuItemService } from 'src/core/services';
import {
  MenuItemVo,
  MenuItemResVo,
  MenuItemUpdateReqVo,
} from 'src/core/models';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/core/guards/role/role.guard';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('menuItem')
@Controller('menuItem')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: MenuItemResVo })
  async Add(@Body() menuItemVo: MenuItemVo, @Res() res) {
    const vo = await this.menuItemService.add(menuItemVo);
    res.json(vo);
  }

  @Put()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: MenuItemResVo })
  async Update(@Body() menuDto: MenuItemUpdateReqVo, @Res() res) {
    const vo = await this.menuItemService.update(menuDto);
    res.json(vo);
  }

  @Delete(':menuItemId')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: Boolean })
  async Delete(@Param('menuItemId') menuId: string, @Res() res) {
    const sucess = await this.menuItemService.delete(menuId);
    res.json(sucess);
  }

  @Delete()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: Boolean })
  async DeleteMany(@Body() menuItemIds: string[], @Res() res) {
    const success = await Promise.all(
      menuItemIds.map((Id) => this.menuItemService.delete(Id)),
    );
    const result = success.reduce((result, value) => result && value, true);
    res.json(result);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: MenuItemResVo })
  async Get(@Query('id') id: string, @Res() res) {
    const vo = await this.menuItemService.get(id);
    res.json(vo);
  }

  @Get('key')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: [MenuItemResVo] })
  async GetByKey(
    @Query('bussinessId') bussinessId: string,
    @Query('key') key: string,
    @Res() res,
  ) {
    // const vos = await this.menuItemService.getItemModificationsByKey(
    //   bussinessId,
    //   key,
    // );
    const vos = await this.menuItemService.getByKey(bussinessId, key);
    res.json(vos);
  }

  @Get(':businessId')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: [MenuItemResVo] })
  async GetByBusiness(@Param('businessId') id: string, @Res() res) {
    const vos = await this.menuItemService.getByBusinessId(id);
    res.json(vos);
  }
}
