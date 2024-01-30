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
      '[{"itemId":"0212f053-7d09-46a4-8153-fe9013dcda10","itemName":"養樂多綠(M)","itemDescription":"","itemPrice":"45","itemPictureUrl":"","totalPrice":"145","modification":{"id":"430ff65f-fe32-4b0b-add0-35aa1f3cb516","businessId":"7709e3c4-57bc-11ee-8c99-0242ac120002","name":"加料","options":[{"布丁":10,"仙草":5}],"maxChoices":2},"memo":"string"}]',
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
