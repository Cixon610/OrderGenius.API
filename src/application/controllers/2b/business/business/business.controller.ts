import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BusinessAddReqVo, BusinessResVo, BusinessUpdateReqVo } from 'src/core/models';
import { BusinessService } from 'src/core/services';

@ApiTags('Business')
@Controller('business')
export class BusinessController {
    constructor(private readonly businessService: BusinessService) {}

    @Post()
    @ApiResponse({ status: 200, type: BusinessResVo })
    async Add(@Body() dto: BusinessAddReqVo, @Res() res) {
      const vo = await this.businessService.add(dto);
      res.json(vo);
    }
  
    @Put()
    @ApiResponse({ status: 200, type: BusinessResVo })
    async Update(@Body() dto: BusinessUpdateReqVo, @Res() res) {
      const vo = await this.businessService.update(dto);
      res.json(vo);
    }
  
    @Delete(':businessId')
    @ApiResponse({ status: 200, type: BusinessResVo })
    async Delete(@Param('businessId') businessId: string, @Res() res) {
      const sucess = await this.businessService.delete(businessId);
      res.json(sucess);
    }
  
    @Get()
    @ApiResponse({ status: 200, type: BusinessResVo })
    async Get(@Query('id') id: string, @Res() res) {
      const vo = await this.businessService.get(id);
      res.json(vo);
    }
    
    @Get('key')
    @ApiResponse({ status: 200, type: [BusinessResVo] })
    async GetByKey(@Query('key') key: string, @Res() res) {
      const vos = await this.businessService.getByKey(key);
      res.json(vos);
    }
}