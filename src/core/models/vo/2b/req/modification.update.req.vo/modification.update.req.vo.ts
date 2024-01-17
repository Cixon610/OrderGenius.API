import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ModificationVo } from 'src/core/models';

export class ModificationUpdateReqVo extends PartialType(ModificationVo) {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '1', description: 'Id' })
  id: string;
}
