import { ApiProperty } from '@nestjs/swagger';

export class LineProfileVo {
  public constructor(init?: Partial<LineProfileVo>) {
    Object.assign(this, init);
  }

  @ApiProperty({ example: 'U4af4980629...' })
  userId: string;

  @ApiProperty({ example: 'LINE taro' })
  displayName: string;

  @ApiProperty({ example: 'https://profile.line-scdn.net/abcdefghijklmn' })
  pictureUrl: string;

  @ApiProperty({ example: 'Hello, LINE!' })
  statusMessage: string;

  @ApiProperty({ example: '7709e3c4-57bc-11ee-8c99-0242ac120002' })
  businessId: string;
}
