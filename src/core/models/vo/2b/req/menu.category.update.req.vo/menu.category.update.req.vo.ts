import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { MenuCategoryVo } from 'src/core/models';

export class MenuCategoryUpdateReqVo extends PartialType(MenuCategoryVo) {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '132403d2c-2b1d-4c8f-8d6f-92f711cd6684',
    description: 'Id',
  })
  id!: string;
}
