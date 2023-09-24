import { ApiProperty } from '@nestjs/swagger';
import { MenuCategoryResVo } from '../menu.category.res.vo/menu.category.res.vo';

export class MenuResVo {
  public constructor(init?: Partial<MenuResVo>) {
    Object.assign(this, init);
  }

  @ApiProperty({ example: 'id', description: 'id' })
  id: string;

  @ApiProperty({ example: 'businessId', description: 'businessId' })
  businessId: string;

  @ApiProperty({ example: 'name', description: 'name' })
  name: string;

  @ApiProperty({ example: 'description', description: 'description' })
  description: string;

  @ApiProperty({
    example: 'https://i.pinimg.com/736x/7c/c0/77/7cc077ed9ad2e5c32a6ef18fe4d06687.jpg',
    description: 'pictureUrl',
  })
  pictureUrl: string | null;

  @ApiProperty({
    example: '["d5de5474-5a01-11ee-8c99-0242ac120002"]',
    description: 'categoryIds',
  })
  menuCategories: MenuCategoryResVo[];
}
