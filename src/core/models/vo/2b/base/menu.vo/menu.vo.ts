import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class MenuVo {
  public constructor(init?: Partial<MenuVo>) {
    Object.assign(this, init);
  }

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '7709e3c4-57bc-11ee-8c99-0242ac120002',
    description: 'businessId',
  })
  businessId!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'MenuName01', description: 'name' })
  name!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'MenuDescription01', description: 'description' })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'https://pbs.twimg.com/media/FVIBWqVUcAEB_9X.jpg:large',
    description: 'pictureUrl',
  })
  pictureUrl?: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    example: 'true',
    description: 'active',
  })
  active?: boolean;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    example: '["d5de5474-5a01-11ee-8c99-0242ac120002"]',
    description: 'categoryIds',
  })
  categoryIds?: string[];
}
