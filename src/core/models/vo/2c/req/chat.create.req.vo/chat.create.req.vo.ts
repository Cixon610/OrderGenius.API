import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class ChatCreateReqVo {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
      example: 'dc9c6e7c-e4e5-44bf-8476-dd1857249a25',
      description: 'businessId',
    })
    businessId: string;
    
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
      example: '110d678c-c055-4241-97c0-392ac0034b67',
      description: 'userId',
    })
    userId: string;
  }
