import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class MenuCategoryVo {
  public constructor(init?: Partial<MenuCategoryVo>) {
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
  @ApiProperty({ example: 'MenuCategoryName01', description: 'name' })
  name!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'MenuCategoryDescription01',
    description: 'description',
  })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'https://pbs.twimg.com/media/FVIBWqVUcAEB_9X.jpg:large',
    description: 'pictureUrl',
  })
  pictureUrl?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    example: '["7e52f036-e1c9-43aa-8870-9076cd9d5e3a"]',
    description: 'menuItemIds',
  })
  menuItemIds?: string[];
}
