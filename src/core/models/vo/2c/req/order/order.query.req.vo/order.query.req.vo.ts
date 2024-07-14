import { ApiProperty } from '@nestjs/swagger';
import { OrderQueryVo } from 'src/core/models';
import { IsArray, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class OrderQueryReqVo extends OrderQueryVo {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'businessId', type: String, required: false })
  businessId?: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({ description: 'tableNo', type: [String], required: false })
  tableNo?: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty({ description: 'status', type: [Number], required: false })
  status?: number[];

  @IsDate()
  @IsOptional()
  @ApiProperty({ description: 'dateFrom', type: Date, required: false })
  dateFrom?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({ description: 'dateTo', type: Date, required: false })
  dateTo?: Date;
}
