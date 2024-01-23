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
import { OrderCreateReqVo } from 'src/core/models';
import { ShoppingCartService } from 'src/core/services';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('shopping-cart')
@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: OrderCreateReqVo })
  async get(@Query('businessId') businessId: string, @Req() req, @Res() res) {
    const vo = await this.shoppingCartService.get(businessId, req.user.id);
    res.json(vo);
  }

  @Put()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: OrderCreateReqVo })
  async update(
    @Query('businessId') businessId: string,
    @Body() dto: OrderCreateReqVo,
    @Req() req,
    @Res() res,
  ) {
    const vo = await this.shoppingCartService.set(businessId, req.user.id, dto);
    res.json(vo);
  }
}
