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
import { MenuItemService, ModificationService } from 'src/core/services';
import {
  MenuItemVo,
  MenuItemResVo,
  MenuItemUpdateReqVo,
  ModificationVo,
  ModificationResVo,
  ModificationUpdateReqVo,
} from 'src/core/models';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/core/guards/role/role.guard';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('modification')
@Controller('modification')
export class ModificationController {
  constructor(private readonly modificationService: ModificationService) {}

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: ModificationResVo })
  async Add(@Body() req: ModificationVo, @Res() res) {
    const vo = await this.modificationService.add(req);
    res.json(vo);
  }

  @Put()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: ModificationResVo })
  async Update(@Body() req: ModificationUpdateReqVo, @Res() res) {
    const vo = await this.modificationService.update(req);
    res.json(vo);
  }

  @Delete(':modificationId')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: Boolean })
  async Delete(@Param('modificationId') id: string, @Res() res) {
    const sucess = await this.modificationService.delete(id);
    res.json(sucess);
  }

  @Delete()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: Boolean })
  async DeleteMany(@Body() ids: string[], @Res() res) {
    const success = await Promise.all(
      ids.map((Id) => this.modificationService.delete(Id)),
    );
    const result = success.reduce((result, value) => result && value, true);
    res.json(result);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: ModificationResVo })
  async Get(@Query('id') id: string, @Res() res) {
    const vo = await this.modificationService.get(id);
    res.json(vo);
  }

  @Get('key')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: [ModificationResVo] })
  async GetByKey(@Query('key') key: string, @Res() res) {
    const vos = await this.modificationService.getByKey(key);
    res.json(vos);
  }

  @Get(':businessId')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: [ModificationResVo] })
  async GetByBusiness(@Param('businessId') id: string, @Res() res) {
    const vos = await this.modificationService.getByBusinessId(id);
    res.json(vos);
  }
}
