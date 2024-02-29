import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/core/guards/role/role.guard';
import { OrderCreateReqVo, OrderResVo } from 'src/core/models';
import { ShoppingCartService } from 'src/core/services';
import { Order } from 'src/infra/typeorm';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('shopping-cart')
@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: OrderResVo })
  async get(@Query('businessId') businessId: string, @Req() req, @Res() res) {
    const vo = await this.shoppingCartService.get(
      businessId,
      req.user.id,
      req.user.username,
    );
    res.json(vo);
  }

  @Put()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: OrderResVo })
  async update(@Body() dto: OrderCreateReqVo, @Req() req, @Res() res) {
    const vo = await this.shoppingCartService.set(
      req.businessId,
      req.user.id,
      req.user.username,
      dto,
    );
    res.json(vo);
  }
}
