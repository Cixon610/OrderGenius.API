import { ApiProperty } from '@nestjs/swagger';
import { OrderCreateReqVo } from 'src/core/models';

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
    example: 'email',
    description: 'OrderCreateReqVo',
  })
  shoppingCart: OrderCreateReqVo;
}
