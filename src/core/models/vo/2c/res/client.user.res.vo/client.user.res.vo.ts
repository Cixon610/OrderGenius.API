import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ClientUserVo } from 'src/core/models';
export class ClientUserResVo extends PartialType(ClientUserVo) {
  public constructor(init?: ClientUserResVo) {
    super(init);
    Object.assign(this, init);
  }
  @ApiProperty({ example: 'id', description: 'id' })
  id: string;
}
