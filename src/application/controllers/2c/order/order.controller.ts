import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderCreateReqVo, OrderResVo } from 'src/core/models';
import { OrderService } from 'src/core/services';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  // @ApiBearerAuth()
  @ApiResponse({ status: 200, type: OrderResVo })
  async Create(@Body() vo: OrderCreateReqVo, @Res() res) {
    const result = await this.orderService.create(vo);
    res.json(result);
  }

  @Get()
  // @ApiBearerAuth()
  @ApiResponse({ status: 200, type: OrderResVo })
  async Get(@Query('id') id: string, @Res() res) {
    const vo = await this.orderService.get(id);
    res.json(vo);
  }
}
