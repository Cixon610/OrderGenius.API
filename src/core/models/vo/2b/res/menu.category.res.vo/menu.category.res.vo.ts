import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { MenuCategoryVo } from 'src/core/models';

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
  
  @Exclude()
  createdAt?: Date | null;
  @Exclude()
  updatedAt?: Date | null;
  @Exclude()
  updateUserId?: string | null;
}
