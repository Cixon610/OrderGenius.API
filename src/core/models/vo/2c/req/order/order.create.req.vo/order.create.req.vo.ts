import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MenuItemModificationDto } from 'src/core/models';

export class OrderDetail {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'itemId',
    example: '567440d3-dc92-4414-a5a0-5871f248c654',
  })
  itemId: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'modifications',
    example: '[{"name": "加料","options": [{"布丁": 10,"仙草": 5}]}]',
  })
  modifications: [MenuItemModificationDto] | null;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'count', example: 1 })
  count: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'memo', example: 'memo' })
  memo: string | null;
}

export class OrderCreateReqVo {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'businessId', type: String })
  businessId: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ description: 'detail', type: [OrderDetail] })
  detail: OrderDetail[] = [];

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'memo', example: 'memo' })
  memo: string | null = null;
}
