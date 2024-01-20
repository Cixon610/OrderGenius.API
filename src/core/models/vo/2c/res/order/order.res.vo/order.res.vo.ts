import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { OrderDetailVo, OrderVo } from 'src/core/models';
export class OrderResVo extends PartialType(OrderVo) {
  public constructor(init?: OrderResVo) {
    super(init);
    Object.assign(this, init);
  }

  @ApiProperty({ example: 'id', description: 'id' })
  id: string;

  @ApiProperty({
    example:
      '[{"itemId":"0212f053-7d09-46a4-8153-fe9013dcda10","itemName":"養樂多綠(M)","itemDescription":"","itemPrice":"45","itemPictureUrl":"","totalPrice":"145","modification":{"id":0,"name":"name","pricing":true,"options":{"key":100},"max_choices":1},"memo":"string"}]',
    description: 'detail',
  })
  detail: OrderDetailVo[] | null;

  @ApiProperty({ example: 'userId', description: 'userId' })
  userId: string;

  @ApiProperty({ example: 'userName', description: 'userName' })
  userName: string;
  
  @Exclude()
  createdAt?: Date | null;
  @Exclude()
  updatedAt?: Date | null;
  @Exclude()
  updateUserId?: string | null;
}
