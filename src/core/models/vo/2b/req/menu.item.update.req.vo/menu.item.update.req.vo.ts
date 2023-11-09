import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { MenuItemVo } from 'src/core/models';

export class MenuItemUpdateReqVo extends PartialType(MenuItemVo) {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '1', description: 'Id' })
  id: string;
}
