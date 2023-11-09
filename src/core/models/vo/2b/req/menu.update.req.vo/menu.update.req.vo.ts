import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { MenuVo } from 'src/core/models';

export class MenuUpdateReqVo extends PartialType(MenuVo) {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '1', description: 'Id' })
  id: string;
}
