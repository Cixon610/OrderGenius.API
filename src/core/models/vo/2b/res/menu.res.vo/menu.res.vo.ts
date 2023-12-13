import { ApiProperty, PartialType } from '@nestjs/swagger';
import { MenuCategoryResVo, MenuVo } from 'src/core/models';

export class MenuResVo extends PartialType(MenuVo) {
  public constructor(init?: MenuResVo) {
    super(init);
    Object.assign(this, init);
  }
  @ApiProperty({
    example: '1c9be2bb4-57be-11ee-8c99-0242ac120002',
    description: 'Id',
  })
  id!: string;
}
