import { ApiProperty } from '@nestjs/swagger';
export class MenuItemModificationDto {
  @ApiProperty({ example: 'name', description: 'name' })
  name: string;

  @ApiProperty({ example: { key: 'price' }, description: 'options' })
  options?: Record<string, number>;
}
