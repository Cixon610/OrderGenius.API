import { ApiProperty, PartialType } from '@nestjs/swagger';
import { OrderDetailVo, OrderVo } from 'src/core/models';
export class OrderResVo extends PartialType(OrderVo) {
  public constructor(init?: OrderResVo) {
    super(init);
    Object.assign(this, init);
  }

  @ApiProperty({ example: 'id', description: 'id' })
  id: string;

  @ApiProperty({ example: 'detail', description: 'detail' })
  detail: OrderDetailVo[] | null;
}
