import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { BusinessUserVo } from 'src/core/models';

export class BusinessUserUpdateReqVo extends PartialType(BusinessUserVo) {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: 'id', description: 'id' })
  id: string;
}
