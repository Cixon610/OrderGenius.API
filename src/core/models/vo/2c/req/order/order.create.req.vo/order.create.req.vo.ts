import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OrderDetail {
  itemId: string | null;
  modification: object | null;
  count: number | null;
  memo: string | null;
}

export class OrderCreateReqVo {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'userId' })
  userId: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ description: 'detail', type: [OrderDetail] })
  detail: OrderDetail[];

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'memo' })
  memo: string | null;
}
