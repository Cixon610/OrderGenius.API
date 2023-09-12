import { ApiProperty } from '@nestjs/swagger';
import { ResBaseVo } from './res.base.vo';

class MenuAddRes {
  @ApiProperty({ example: 'id', description: 'id' })
  id: string;

  @ApiProperty({ example: 'businessId', description: 'businessId' })
  businessId: string;

  @ApiProperty({ example: 'name', description: 'name' })
  name: string;

  @ApiProperty({ example: 'description', description: 'description' })
  description: string;
}

export class MenuAddResVo extends ResBaseVo<MenuAddRes> {}
