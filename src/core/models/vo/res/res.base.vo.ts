import { ApiProperty } from '@nestjs/swagger';

export class ResBaseVo<T> {
  @ApiProperty({ example: 'data', description: 'data' })
  data: T;
}
