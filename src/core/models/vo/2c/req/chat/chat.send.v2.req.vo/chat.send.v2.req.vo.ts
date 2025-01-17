import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatSendV2ReqVo {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '7709e3c4-57bc-11ee-8c99-0242ac120002',
    description: 'businessId',
  })
  businessId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '4f2bbdf6-a81c-4df6-acca-cff999816aed',
    description: 'sessionId',
  })
  sessionId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'I want bubble tea.',
    description: 'content',
  })
  content: string;
}
