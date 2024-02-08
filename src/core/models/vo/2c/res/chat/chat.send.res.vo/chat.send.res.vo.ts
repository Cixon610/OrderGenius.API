import { ApiProperty } from '@nestjs/swagger';
import { OrderResVo } from 'src/core/models';

export class ChatSendResVo {
  public constructor(init?: ChatSendResVo) {
    Object.assign(this, init);
  }
  @ApiProperty({
    example: 'message',
    description: 'message',
  })
  message: string;

  @ApiProperty({
    example: 'shoppingCart',
    description: 'OrderResVo',
  })
  shoppingCart: OrderResVo;
}
