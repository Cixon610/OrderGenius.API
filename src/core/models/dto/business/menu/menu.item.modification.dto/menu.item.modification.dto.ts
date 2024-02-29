import { ApiProperty } from '@nestjs/swagger';
export class MenuItemModificationDto {
  @ApiProperty({ example: '加料', description: 'name' })
  name: string;

  @ApiProperty({
    example: "[{ 'name': '布丁', 'price': 10},{ 'name': '仙草', 'price': 5}]",
    description: 'options',
  })
  options?: [optionDto];
}
export class optionDto {
  @ApiProperty({ example: '布丁', description: 'name' })
  name: string;

  @ApiProperty({ example: 10, description: 'price' })
  price: number;
}
