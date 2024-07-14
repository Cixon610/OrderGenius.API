import { ApiProperty } from "@nestjs/swagger";
import { IsArray, isArray, IsOptional, IsString } from "class-validator";

export class OrderQueryVo {
  @IsArray()
  @IsOptional()
  @ApiProperty({ description: 'orderId', type: [String] })
  orderId?: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty({ description: 'userId', type: [String] })
  userId?: string[];
}
