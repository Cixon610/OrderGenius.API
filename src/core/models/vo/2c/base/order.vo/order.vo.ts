import { ApiProperty } from '@nestjs/swagger';

export class OrderVo {
  public constructor(init?: Partial<OrderVo>) {
    Object.assign(this, init);
  }

  @ApiProperty({ example: 'userCId', description: 'userCId' })
  userCId: string;

  @ApiProperty({ example: 'totalValue', description: 'totalValue' })
  totalValue: number;

  @ApiProperty({ example: 'totalCount', description: 'totalCount' })
  totalCount: number;

  @ApiProperty({ example: 'memo', description: 'memo' })
  memo: string;
}
