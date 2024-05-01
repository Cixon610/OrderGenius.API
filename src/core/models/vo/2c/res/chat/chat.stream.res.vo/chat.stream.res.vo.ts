import { ApiProperty } from "@nestjs/swagger";

export class ChatStreamResVo {
  public constructor(init?: ChatStreamResVo) {
    Object.assign(this, init);
  }
  @ApiProperty({
    example: '7709e3c4-57bc-11ee-8c99-0242ac120002',
    description: 'businessId',
  })
  type: string;

  @ApiProperty({
    example: '',
    description: 'sessionId',
  })
  content: any;
}
