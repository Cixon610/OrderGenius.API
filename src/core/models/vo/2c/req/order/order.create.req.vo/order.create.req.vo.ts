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
  @ApiProperty({ description: 'itemId' })
  itemId: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'modifications',
    example:
      '[{"businessId":"7709e3c4-57bc-11ee-8c99-0242ac120002","name":"加料","options":[{"布丁":10,"椰果":10}]}]',
  })
  modifications: [MenuItemModificationDto] | null;

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
  detail: OrderDetail[] = [];

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'memo' })
  memo: string | null = null;
}
