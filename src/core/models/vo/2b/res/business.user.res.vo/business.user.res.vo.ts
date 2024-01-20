import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BusinessUserVo } from 'src/core/models';
export class BusinessUserResVo extends PartialType(BusinessUserVo) {
  public constructor(init?: BusinessUserResVo) {
    super(init);
    Object.assign(this, init);
  }
  @ApiProperty({ example: 'id', description: 'id' })
  id: string;
  
  @Exclude()
  password?: string | null;
  @Exclude()
  createdAt?: Date | null;
  @Exclude()
  updatedAt?: Date | null;
}
