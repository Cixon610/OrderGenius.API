import { ApiProperty } from '@nestjs/swagger';
export class MenuItemResVo {
  public constructor(init?: Partial<MenuItemResVo>) {
    Object.assign(this, init);
  }
  @ApiProperty({ example: 'id', description: 'id' })
  id: string;

  @ApiProperty({ example: 'id', description: 'id' })
  businessId: string;

  @ApiProperty({ example: 'name', description: 'name' })
  name: string;

  @ApiProperty({ example: 'description', description: 'description' })
  description: string | null;

  @ApiProperty({ example: 10.99, description: 'price' })
  price: number;

  @ApiProperty({
    example: { size: 'large', color: 'red' },
    description: 'modification',
  })
  modification: object | null;

  @ApiProperty({ example: 'extra cheese', description: 'note' })
  note: string | null;

  @ApiProperty({ example: true, description: 'enable' })
  enable: boolean;

  @ApiProperty({
    example: 'https://example.com/pizza.jpg',
    description: 'pictureUrl',
  })
  pictureUrl: string | null;
}
