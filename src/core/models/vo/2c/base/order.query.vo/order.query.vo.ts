import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class OrderQueryVo {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'orderId', type: String })
  orderId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'userId', type: String })
  userId?: string;
}
