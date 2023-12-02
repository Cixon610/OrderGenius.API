import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class MenuItemVo {
  public constructor(init?: Partial<MenuItemVo>) {
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
  @ApiProperty({ example: 'MenuItemName', description: 'name' })
  name!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'MenuItemDescription', description: 'description' })
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: '100', description: 'price' })
  price!: number;

  @IsOptional()
  @ApiProperty({ example: '["Property01":"01"]', description: 'modification' })
  modification?: object;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'note', description: 'note' })
  note?: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: true, description: 'enable' })
  enable!: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: true, description: 'promoted' })
  promoted!: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example:
      'https://img.meepshop.com/r1RTAjt-AGmW_gdd6v1PhZwRem_RN192sA7zUMA-ajU/w:960/Z3M6Ly9pbWcubWVlcGNsb3VkLmNvbS9tZWVwc2hvcC9kMzljODBiYi1lNzQxLTQyMjYtYWNiZS1kOTc1ODVmMDVlMWQvZmlsZXMvNjhlYTM2ZjEtYWQwMS00MzZhLTg2YjQtMDk2NjljM2QyMGFiLmpwZw',
    description: 'pictureUrl',
  })
  pictureUrl?: string;
}
