import { ApiProperty } from '@nestjs/swagger';
import { OrderQueryVo } from 'src/core/models';
import { IsArray, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

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
  @Type(() => Date)
  @ApiProperty({ description: 'dateFrom', type: Date, required: false })
  dateFrom?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiProperty({ description: 'dateTo', type: Date, required: false })
  dateTo?: Date;
}
