import { ApiProperty } from '@nestjs/swagger';
import { MenuItemResVo } from 'src/core/models';

export class MenuCategoryResVo {
  public constructor(init?: Partial<MenuCategoryResVo>) {
    Object.assign(this, init);
  }

  @ApiProperty({ example: 'id', description: 'id' })
  id: string;

  @ApiProperty({ example: 'businessId', description: 'businessId' })
  businessId: string;

  @ApiProperty({ example: 'name', description: 'name' })
  name: string;

  @ApiProperty({ example: 'description', description: 'description' })
  description: string | null;

  @ApiProperty({ example: 'pictureUrl', description: 'pictureUrl' })
  pictureUrl: string | null;

  @ApiProperty({ example: 'menuItems', description: 'menuItems' })
  menuItems: MenuItemResVo[];
}
