import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatSendReqVo {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'businessId',
    description: 'businessId',
  })
  businessId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'asst_iESCuPyBgLfZZuJxrYSEIfGk',
    description: 'assistantId',
  })
  assistantId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'thread_7r7GVJww0jcHjB8aoog7mLe0',
    description: 'threadId',
  })
  threadId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'content',
    description: 'I want bubble tea.',
  })
  content: string;
}
