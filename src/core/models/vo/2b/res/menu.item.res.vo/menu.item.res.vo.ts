import { ApiProperty, PartialType } from '@nestjs/swagger';
import { MenuItemVo } from 'src/core/models';
export class MenuItemResVo extends PartialType(MenuItemVo) {
  public constructor(init?: MenuItemResVo) {
    super(init);
    Object.assign(this, init);
  }
  @ApiProperty({ example: '1', description: 'Id' })
  id: string;
}
