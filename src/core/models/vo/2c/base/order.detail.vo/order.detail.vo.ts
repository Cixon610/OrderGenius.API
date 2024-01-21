import { ApiProperty } from '@nestjs/swagger';
import { MenuItemModificationDto } from 'src/core/models';

export class OrderDetailVo {
  public constructor(init?: Partial<OrderDetailVo>) {
    Object.assign(this, init);
  }
  //   @ApiProperty({ example: 'orderId', description: 'orderId' })
  //   orderId: string;

  @ApiProperty({ example: 'itemId', description: 'itemId' })
  itemId: string;

  @ApiProperty({ example: 'itemName', description: 'itemName' })
  itemName: string;

  @ApiProperty({ example: 'itemDescription', description: 'itemDescription' })
  itemDescription: string;

  @ApiProperty({ example: 100, description: 'itemPrice' })
  itemPrice: Number;

  @ApiProperty({ example: 'itemPictureUrl', description: 'itemPictureUrl' })
  itemPictureUrl: string;

  @ApiProperty({ example: 100, description: 'totalPrice' })
  totalPrice: Number;

  @ApiProperty({ example: 'modification', description: 'modification' })
  modification: MenuItemModificationDto[] | Object | null;

  @ApiProperty({ example: 'memo', description: 'memo' })
  memo: string;
}
