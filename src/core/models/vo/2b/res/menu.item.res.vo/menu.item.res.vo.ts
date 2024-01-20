import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { MenuItemVo } from 'src/core/models';
export class MenuItemResVo extends PartialType(MenuItemVo) {
  public constructor(init?: MenuItemResVo) {
    super(init);
    Object.assign(this, init);
  }
  @ApiProperty({ example: '1', description: 'Id' })
  id: string;
  
  @Exclude()
  createdAt?: Date | null;
  @Exclude()
  updatedAt?: Date | null;
  @Exclude()
  updateUserId?: string | null;
}
