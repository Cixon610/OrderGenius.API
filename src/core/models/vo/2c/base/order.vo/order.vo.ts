import { ApiProperty } from '@nestjs/swagger';

export class OrderVo {
  public constructor(init?: Partial<OrderVo>) {
    Object.assign(this, init);
  }

  @ApiProperty({ example: 100, description: 'totalValue' })
  totalValue: number;

  @ApiProperty({ example: 2, description: 'totalCount' })
  totalCount: number;

  @ApiProperty({ example: 'memo', description: 'memo' })
  memo: string;
}
