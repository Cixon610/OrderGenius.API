import { ApiProperty } from '@nestjs/swagger';

export class LineLoginResVo {
  public constructor(init?: Partial<LineLoginResVo>) {
    Object.assign(this, init);
  }

  @ApiProperty({ example: 'https://access.line.me/oauth2/v2.1/authorize?', description: 'url' })
  url: string;
}
