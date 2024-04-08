import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatSendV2ReqVo {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'businessId',
    description: 'businessId',
  })
  businessId: string;
  
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'thread_7r7GVJww0jcHjB8aoog7mLe0',
    description: 'threadId',
  })
  sessionId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'content',
    description: 'I want bubble tea.',
  })
  content: string;
}
