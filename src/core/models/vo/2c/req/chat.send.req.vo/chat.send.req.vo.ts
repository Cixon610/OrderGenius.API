import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ChatSendReqVo {
    @IsNotEmpty()
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
      description: 'content',
    })
    content: string;
  }
