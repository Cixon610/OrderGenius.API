import { ApiProperty } from '@nestjs/swagger';

export class ChatSendV2ResVo {
  public constructor(init?: ChatSendV2ResVo) {
    Object.assign(this, init);
  }
  @ApiProperty({
    example: '7709e3c4-57bc-11ee-8c99-0242ac120002',
    description: 'businessId',
  })
  businessId: string;

  @ApiProperty({
    example: '4f2bbdf6-a81c-4df6-acca-cff999816aed',
    description: 'sessionId',
  })
  sessionId: string;
}
