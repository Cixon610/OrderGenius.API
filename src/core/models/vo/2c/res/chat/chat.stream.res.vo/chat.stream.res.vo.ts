import { ApiProperty } from "@nestjs/swagger";

export class ChatStreamResVo {
  public constructor(init?: ChatStreamResVo) {
    Object.assign(this, init);
  }
  @ApiProperty({
    example: 'message | shoppingCart',
    description: 'type',
  })
  type: string;

  @ApiProperty({
    example: 'text | object',
    description: 'content',
  })
  content: any;
}
