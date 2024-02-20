import { ApiProperty } from '@nestjs/swagger';
import { MenuItemModificationDto } from 'src/core/models';

export class OrderDetailVo {
  public constructor(init?: Partial<OrderDetailVo>) {
    Object.assign(this, init);
  }
  //   @ApiProperty({ example: 'orderId', description: 'orderId' })
  //   orderId: string;

  @ApiProperty({
    example: '567440d3-dc92-4414-a5a0-5871f248c654',
    description: 'itemId',
  })
  itemId: string;

  @ApiProperty({ example: '梅の綠', description: 'itemName' })
  itemName: string;

  @ApiProperty({ example: '梅子綠茶', description: 'itemDescription' })
  itemDescription: string;

  @ApiProperty({ example: 100, description: 'itemPrice' })
  itemPrice: number;

  @ApiProperty({
    example:
      'https://th.bing.com/th/id/R.51eb64c1f9e4b7bb3b2ea7630b6941ba?rik=9R35tlsifpBQNA&pid=ImgRaw&r=0',
    description: 'itemPictureUrl',
  })
  itemPictureUrl: string;

  @ApiProperty({ example: 100, description: 'totalPrice' })
  totalPrice: number;

  @ApiProperty({ example: 1, description: 'count' })
  count: number;

  @ApiProperty({
    example: '[{"name": "加料","options": [{"布丁": 10,"仙草": 5}]}]',
    description: 'modification',
  })
  modification: MenuItemModificationDto[] | object | null;

  @ApiProperty({ example: 'memo', description: 'memo' })
  memo: string;
}
