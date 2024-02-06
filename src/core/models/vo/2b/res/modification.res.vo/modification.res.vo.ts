import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ModificationVo } from 'src/core/models';
export class ModificationResVo extends PartialType(ModificationVo) {
  public constructor(init?: ModificationResVo) {
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
