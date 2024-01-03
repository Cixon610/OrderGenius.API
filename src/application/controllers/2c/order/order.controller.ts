import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { OrderCreateReqVo } from 'src/core/models';
import { OrderService } from 'src/core/services';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
    
  @Post()
  // @ApiBearerAuth()
  // @ApiResponse({ status: 200, type: BusinessResVo })
  async Create(@Body()vo: OrderCreateReqVo, @Res() res) {
    const result = await this.orderService.create(
    );
    res.json(result);
  }

  @Get()
  // @ApiBearerAuth()
  // @ApiResponse({ status: 200, type: BusinessResVo })
  async Get(@Query('id') id: string, @Res() res) {
    const vo = await this.orderService.get(id);
    res.json(vo);
  }

}
