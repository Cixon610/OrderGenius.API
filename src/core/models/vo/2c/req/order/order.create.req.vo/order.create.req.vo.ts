import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MenuItemModificationDto } from 'src/core/models';

export class OrderDetail {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'itemId' })
  itemId: string;

  @IsOptional()
  @ApiProperty({ description: 'modification' })
  modification: MenuItemModificationDto | null;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'count' })
  count: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'memo' })
  memo: string | null;
}

export class OrderCreateReqVo {

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ description: 'detail', type: [OrderDetail] })
  detail: OrderDetail[];

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'memo' })
  memo: string | null;
}
