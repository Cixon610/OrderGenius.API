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
import { RoleGuard } from 'src/core/guards/role/role.guard';
import { OrderCreateReqVo, OrderResVo } from 'src/core/models';
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

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: OrderResVo })
  async Get(@Query('id') id: string, @Res() res) {
    const vo = await this.orderService.get(id);
    res.json(vo);
  }

  @Get(':userId')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: OrderResVo })
  async GetByUserId(@Param('userId') userId: string, @Res() res) {
    const vo = await this.orderService.getByUserId(userId);
    res.json(vo);
  }
}
