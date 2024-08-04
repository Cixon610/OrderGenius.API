import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Server } from 'socket.io';
import { RoleGuard } from 'src/core/guards/role/role.guard';
import {
  OrderCreateReqVo,
  OrderQueryReqVo,
  OrderQueryVo,
  OrderResVo,
  OrderUpdateReqVo,
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

  @Put()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: Boolean })
  async UpdateInfo(@Body() vo: OrderUpdateReqVo, @Res() res) {
    const result = await this.orderService.update(vo);
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

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: Boolean })
  async Notify(@Query() businessId: string, @Query() orderId: string) {const signaturePayload = `7709e3c4-57bc-11ee-8c99-0242ac120002_7d3f1a09-8068-4400-83d7-1b3631d78f5d_1722760838`;
    this.orderService.test();
    this.orderService.notifyTest(
      '7709e3c4-57bc-11ee-8c99-0242ac120002',
      'Test123',
    );
  }
}
