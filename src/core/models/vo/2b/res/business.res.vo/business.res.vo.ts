import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BusinessVo } from 'src/core/models';

export class BusinessResVo extends PartialType(BusinessVo) {
  public constructor(init?: BusinessResVo) {
    super(init);
    Object.assign(this, init);
  }
  @ApiProperty({
    example: '7709e3c4-57bc-11ee-8c99-0242ac120002',
    description: 'id',
  })
  id!: string;
}
