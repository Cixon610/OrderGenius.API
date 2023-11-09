import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { BusinessVo } from 'src/core/models';

export class BusinessUpdateReqVo extends PartialType(BusinessVo) {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '7709e3c4-57bc-11ee-8c99-0242ac120002',
    description: 'id',
  })
  id!: string;
}
