import { ApiProperty, PartialType } from '@nestjs/swagger';
import { MenuCategoryVo, MenuItemResVo } from 'src/core/models';

export class MenuCategoryResVo extends PartialType(MenuCategoryVo) {
  public constructor(init?: MenuCategoryResVo) {
    super(init);
    Object.assign(this, init);
  }
  @ApiProperty({
    example: '132403d2c-2b1d-4c8f-8d6f-92f711cd6684',
    description: 'Id',
  })
  id!: string;

  @ApiProperty({
    example: '["7e52f036-e1c9-43aa-8870-9076cd9d5e3a"]',
    description: '[MenuItem]',
  })
  menuItems?: MenuItemResVo[];
}
