import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/core/guards/role/role.guard';
import {
  OrderCreateReqVo,
  OrderQueryReqVo,
  OrderQueryVo,
  OrderResVo,
  OrderUpdateStatusReqVo,
} from 'src/core/models';
import { OrderService } from 'src/core/services';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: OrderResVo })
  async Create(@Req() req, @Body() vo: OrderCreateReqVo, @Res() res) {
    const result = await this.orderService.create(req.user, vo);
    res.json(result);
  }

  @Post('query/business')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: OrderResVo })
  async QueryBusiness(@Body() vo: OrderQueryReqVo, @Res() res) {
    const result = await this.orderService.query(vo);
    res.json(result);
  }

  @Post('query/client')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: OrderResVo })
  async QueryClient(@Body() vo: OrderQueryVo, @Res() res) {
    const result = await this.orderService.query(vo);
    res.json(result);
  }

  @Post('status')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: Boolean })
  async UpdateStatus(@Body() vo: OrderUpdateStatusReqVo, @Res() res) {
    const result = await this.orderService.updateStatus(vo.id, vo.status);
    res.json(result);
  }
}
