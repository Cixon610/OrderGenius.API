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
import {
  BusinessVo,
  BusinessResVo,
  BusinessUpdateReqVo,
} from 'src/core/models';
import { BusinessService } from 'src/core/services';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Business')
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: BusinessResVo })
  async Add(@Body() dto: BusinessVo, @Res() res) {
    const vo = await this.businessService.add(dto);
    if(dto.userIds && dto.userIds.length > 0){
      this.businessService.updateBusinessUser(vo.id, dto.userIds);
    }
    res.json(vo);
  }

  @Put()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: BusinessResVo })
  async Update(@Body() dto: BusinessUpdateReqVo, @Res() res) {
    const vo = await this.businessService.update(dto);
    if(dto.userIds && dto.userIds.length > 0){
      this.businessService.updateBusinessUser(dto.id, dto.userIds);
    }
    res.json(vo);
  }

  @Delete(':businessId')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: Boolean })
  async Delete(@Param('businessId') businessId: string, @Res() res) {
    const sucess = await this.businessService.delete(businessId);
    res.json(sucess);
  }

  @Delete()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: Boolean })
  async DeleteMany(@Body() businessIds: string[], @Res() res) {
    const success = await Promise.all(
      businessIds.map((Id) => this.businessService.delete(Id))
    );
    const result = success.reduce((result, value) => result && value, true);
    res.json(result);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: BusinessResVo })
  async Get(@Query('id') id: string, @Res() res) {
    const vo = await this.businessService.get(id);
    res.json(vo);
  }

  @Get('key')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: [BusinessResVo] })
  async GetByKey(@Query('key') key: string, @Res() res) {
    const vos = await this.businessService.getByKey(key);
    res.json(vos);
  }
}
