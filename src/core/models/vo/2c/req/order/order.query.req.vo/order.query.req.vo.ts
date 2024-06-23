import { ApiProperty } from '@nestjs/swagger';
import { OrderQueryVo } from 'src/core/models';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class OrderQueryReqVo extends OrderQueryVo {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'businessId', type: String })
  businessId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'tableNo', type: String })
  tableNo?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'status', type: Number })
  status?: number;

  @IsDate()
  @IsOptional()
  @ApiProperty({ description: 'dateFrom', type: Date })
  dateFrom?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({ description: 'dateTo', type: Date })
  dateTo?: Date;
}
