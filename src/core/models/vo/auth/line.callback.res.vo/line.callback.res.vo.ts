import { ApiProperty, PartialType } from '@nestjs/swagger';
import { LineProfileVo, LoginResVo } from 'src/core/models';

export class LineCallbackResVo extends PartialType(LoginResVo) {
  public constructor(init?: Partial<LineCallbackResVo>) {
    super(init);
    Object.assign(this, init);
  }

  @ApiProperty({ type: () => LineProfileVo })
  profile: LineProfileVo;
}
