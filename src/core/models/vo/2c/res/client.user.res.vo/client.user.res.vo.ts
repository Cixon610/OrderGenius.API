import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ClientUserVo } from 'src/core/models';
export class ClientUserResVo extends PartialType(ClientUserVo) {
  public constructor(init?: ClientUserResVo) {
    super(init);
    Object.assign(this, init);
  }
  @ApiProperty({ example: 'id', description: 'id' })
  id: string;

  @Exclude()
  createdAt?: Date | null;
  @Exclude()
  updatedAt?: Date | null;
  @Exclude()
  updateUserId?: string | null;
}
