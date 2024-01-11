import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ClientUserVo } from 'src/core/models';

export class ClientUserUpdateReqVo extends PartialType(ClientUserVo) {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: 'id', description: 'id' })
  id: string;
}
