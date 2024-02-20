import { ApiProperty } from '@nestjs/swagger';
export class MenuItemModificationDto {
  @ApiProperty({ example: '加料', description: 'name' })
  name: string;

  @ApiProperty({
    example: "[{ '布丁': 10, '仙草': 20 }]",
    description: 'options',
  })
  options?: Record<string, number>;
}
