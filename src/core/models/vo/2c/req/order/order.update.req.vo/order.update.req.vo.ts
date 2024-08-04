import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { OrderCreateReqVo } from "src/core/models";

export class OrderUpdateReqVo extends PartialType(OrderCreateReqVo) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'orderId', type: String })
  orderId: string;
}
