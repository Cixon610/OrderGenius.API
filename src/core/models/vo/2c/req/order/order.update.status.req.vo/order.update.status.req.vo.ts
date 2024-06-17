import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { OrderStatusEnum } from "src/core/constants/enums/order.status.enum";

export class OrderUpdateStatusReqVo {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'orderId', type: String })
  id: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'status', enum: OrderStatusEnum })
  status: number;
}
