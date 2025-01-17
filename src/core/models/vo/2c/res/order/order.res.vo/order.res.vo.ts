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
      '[{"itemId":"567440d3-dc92-4414-a5a0-5871f248c654","itemName":"梅の綠","itemDescription":"","itemPrice":50,"itemPictureUrl":"","totalPrice":65,"count":1,"modification":[{"name":"加料","options":[{"布丁":10,"仙草":5}]}],"memo":"memo"}]',
    description: 'detail',
  })
  detail: OrderDetailVo[] | null;

  @ApiProperty({
    example: '77dce640-038e-4936-ac8b-501baf286ff2',
    description: 'userId',
  })
  userId: string;

  @ApiProperty({ example: 'Ryan', description: 'userName' })
  userName: string;

  @ApiProperty({
    example: '7709e3c4-57bc-11ee-8c99-0242ac120002',
    description: 'businessId',
  })
  businessId: string;

  @ApiProperty({ description: 'tableNo', example: 'No.8' })
  tableNo: string | null = null;

  @ApiProperty({ description: 'status', example: '1' })
  status: number | null = null;
}
