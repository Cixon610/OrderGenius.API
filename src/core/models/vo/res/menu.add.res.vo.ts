import { ApiProperty } from '@nestjs/swagger';
import { ResBaseVo } from './res.base.vo';

export class MenuAddRes {
  public constructor(init?: Partial<MenuAddRes>) {
    Object.assign(this, init);
  }

  @ApiProperty({ example: 'id', description: 'id' })
  id: string;

  @ApiProperty({ example: 'businessId', description: 'businessId' })
  businessId: string;

  @ApiProperty({ example: 'name', description: 'name' })
  name: string;

  @ApiProperty({ example: 'description', description: 'description' })
  description: string;
}

export class MenuAddResVo extends ResBaseVo<MenuAddRes> {
  constructor(data: MenuAddRes) {
    super();
    this.data = data;
  }
}
